from dotenv import load_dotenv
import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.messages import HumanMessage

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemma-3-12b-it",  # ✅ FREE, no quotas from your list
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

# Modern LCEL chains (no deprecated LLMChain/MultiPromptChain)
def create_chain(prompt_template):
    """LCEL chain: prompt | llm | parser"""
    prompt = PromptTemplate.from_template(prompt_template)
    return prompt | llm | StrOutputParser()

# Base analysis chains
viewpoint_a_chain = create_chain("Topic: {topic}\nGenerate Viewpoint A (pro/positive perspective) in 3-4 sentences.")
viewpoint_b_chain = create_chain("Topic: {topic}\nGenerate Viewpoint B (con/negative perspective) in 3-4 sentences.")
contradiction_chain = create_chain(
    """Viewpoint A: {viewpoint_a}
Viewpoint B: {viewpoint_b}
Explain why the contradiction exists between these viewpoints in 2-3 sentences."""
)
uncertain_chain = create_chain(
    """Viewpoint A: {viewpoint_a}
Viewpoint B: {viewpoint_b}
Identify what remains uncertain or requires more evidence in 2 sentences."""
)

# Simple perspective router (modern replacement for deprecated MultiPromptChain)
perspective_prompts = {
    "general": "Analyze {topic} from a general/public opinion perspective, generating balanced viewpoints.",
    "scientific": "Analyze {topic} from a scientific/evidence-based perspective, generating balanced viewpoints.",
    "economic": "Analyze {topic} from an economic/cost-benefit perspective, generating balanced viewpoints.",
    "ethical": "Analyze {topic} from an ethical/moral perspective, generating balanced viewpoints."
}

def get_perspective_chain(perspective):
    if perspective not in perspective_prompts:
        perspective = "general"
    return create_chain(perspective_prompts[perspective])

def analyze_topic(topic: str, perspective: str = "base"):
    if perspective != "base":
        chain = get_perspective_chain(perspective)
        result = chain.invoke({"topic": topic})
        return {"perspective_analysis": result}
    
    # Sequential base analysis
    vp_a = viewpoint_a_chain.invoke({"topic": topic})
    vp_b = viewpoint_b_chain.invoke({"topic": topic})
    contra = contradiction_chain.invoke({"viewpoint_a": vp_a, "viewpoint_b": vp_b})
    uncert = uncertain_chain.invoke({"viewpoint_a": vp_a, "viewpoint_b": vp_b})
    
    return {
        "viewpoint_a": vp_a,
        "viewpoint_b": vp_b,
        "contradiction": contra,
        "uncertain": uncert
    }
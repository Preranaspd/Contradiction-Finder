document.getElementById('analyzeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const topic = document.getElementById('topic').value.trim();
    const perspective = document.getElementById('perspective').value;
    const loadingEl = document.getElementById('loading');
    const resultsEl = document.getElementById('results');
    const errorEl = document.getElementById('error');
    
    // Clear previous results
    resultsEl.style.display = 'none';
    resultsEl.innerHTML = '';
    errorEl.style.display = 'none';
    
    // Show loading
    loadingEl.style.display = 'block';
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic, perspective })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.data, perspective);
        } else {
            throw new Error(data.error || 'Analysis failed');
        }
    } catch (error) {
        errorEl.textContent = `Error: ${error.message}`;
        errorEl.style.display = 'block';
    } finally {
        loadingEl.style.display = 'none';
    }
});

function displayResults(data, perspective) {
    const resultsEl = document.getElementById('results');
    
    let html = '';
    
    if (perspective === 'base') {
        html = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="section" style="border-left: 5px solid #10b981;">
                    <h3>✅ <strong>Viewpoint A</strong> (Pro)</h3>
                    <p>${formatText(data.viewpoint_a)}</p>
                </div>
                <div class="section" style="border-left: 5px solid #ef4444;">
                    <h3>❌ <strong>Viewpoint B</strong> (Con)</h3>
                    <p>${formatText(data.viewpoint_b)}</p>
                </div>
            </div>
            
            <div class="section" style="border-left: 5px solid #f59e0b;">
                <h3>⚡ <strong>Core Contradiction</strong></h3>
                <p><strong>${highlightKeyPoints(data.contradiction)}</strong></p>
            </div>
            
            <div class="section" style="border-left: 5px solid #8b5cf6;">
                <h3>❓ <strong>Uncertainties</strong></h3>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #e2e8f0;">
                    ${formatUncertainties(data.uncertain)}
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="perspective-hero" style="background: linear-gradient(135deg, ${getPerspectiveColor(perspective)} 0%, ${getPerspectiveColor(perspective)}ee 100%); padding: 25px; border-radius: 15px; text-align: center; color: white; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 1.8em;">🔬 ${perspective.toUpperCase()} PERSPECTIVE</h2>
            </div>
            <div class="section">
                <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    ${formatLongText(data.perspective_analysis)}
                </div>
            </div>
        `;
    }
    
    resultsEl.innerHTML = html;
    resultsEl.style.display = 'block';
}
// Add after line with resultsEl.style.display = 'block';
    const summary = createSummaryCards(data, perspective);
    resultsEl.innerHTML = summary + html;
function createSummaryCards(data, perspective) {
    if (perspective === 'base') {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                    <h4 style="margin: 0 0 10px 0;">📈 Pro Arguments</h4>
                    <p style="margin: 0; font-size: 14px;">${countKeyPoints(data.viewpoint_a)} key points</p>
                </div>
                <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                    <h4 style="margin: 0 0 10px 0;">📉 Con Arguments</h4>
                    <p style="margin: 0; font-size: 14px;">${countKeyPoints(data.viewpoint_b)} key points</p>
                </div>
                <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                    <h4 style="margin: 0 0 10px 0;">⚠️ Conflict Level</h4>
                    <p style="margin: 0; font-size: 14px;">HIGH</p>
                </div>
            </div>
        `;
    }
    return '';
}

function countKeyPoints(text) {
    return (text.match(/•|•|[-*]/g) || []).length + 1;
}

function formatText(text) {
    return text.replace(/\n/g, '<br>').replace(/\*/g, '<strong>');
}

function highlightKeyPoints(text) {
    return `<span style="background: linear-gradient(90deg, #fef3c7, #fde68a); padding: 4px 8px; border-radius: 20px; font-weight: 600;">${text}</span>`;
}

function formatUncertainties(text) {
    return `<ul style="margin: 0; padding-left: 20px; color: #64748b;">${text.split('.').slice(0,-1).map(s => `<li>${s.trim()}</li>`).join('')}</ul>`;
}

function formatLongText(text) {
    // Add emojis and break long paragraphs
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1e293b;">$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/gm, '<p>')
        .replace(/•/g, '• ')
        .replace(/(\d+\.)/g, '<strong>$1</strong>');
}

function getPerspectiveColor(perspective) {
    const colors = {
        general: '#3b82f6',
        scientific: '#10b981',
        economic: '#f59e0b',
        ethical: '#ef4444'
    };
    return colors[perspective] || '#6b7280';
}


function formatText(text) {
    return text.replace(/\n/g, '<br>').replace(/\*/g, '<strong>');
}

function highlightKeyPoints(text) {
    return `<span style="background: linear-gradient(90deg, #fef3c7, #fde68a); padding: 4px 8px; border-radius: 20px; font-weight: 600;">${text}</span>`;
}

function formatUncertainties(text) {
    return `<ul style="margin: 0; padding-left: 20px; color: #64748b;">${text.split('.').slice(0,-1).map(s => `<li>${s.trim()}</li>`).join('')}</ul>`;
}

function formatLongText(text) {
    // Add emojis and break long paragraphs
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1e293b;">$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/gm, '<p>')
        .replace(/•/g, '• ')
        .replace(/(\d+\.)/g, '<strong>$1</strong>');
}

function getPerspectiveColor(perspective) {
    const colors = {
        general: '#3b82f6',
        scientific: '#10b981',
        economic: '#f59e0b',
        ethical: '#ef4444'
    };
    return colors[perspective] || '#6b7280';
}
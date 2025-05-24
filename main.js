import { Profile, Data } from "./graph.js";

// DOM helper functions
const $ = id => document.getElementById(id);
const updateElement = (id, value) => { const el = $(id); if (el) el.innerHTML = value; };
const setDisplay = (id, display) => { const el = $(id); if (el) el.style.display = display; };

// Common colors
const colors = {
    skill: {
        line: "var(--black, #333)", polygon: "var(--graphcolor, rgba(52, 152, 219, 0.2))",
        stroke: "#3498db", point: "#2ecc71", text: "var(--black, #333)"
    },
    module: {
        background: "transparent", polygon: "#3498db", stroke: "#2980b9",
        point: "#2c3e50", grid: "rgba(0,0,0,0.07)", text: "#7f8c8d"
    }
};

export function logout() {
    localStorage.removeItem('token');
    
    // Hide header elements
    ['show_Name', 'logout_btn'].forEach(id => setDisplay(id, 'none'));
    
    // Reset all data values
    const elements = {
        'show_audit_ratio': '0', 'show_audit_total': '0',
        'show_audit_successRate': '0 %', 'show_audit_failRate': '0 %',
        'show_level': '0', 'show_last_transactions': '',
        'show_module_time': '', 'show_module_nodata': 'No Data Yet',
        'show_total_xp': ''
    };
    Object.entries(elements).forEach(([id, value]) => updateElement(id, value));
    
    // Reset graphs and module numbers
    updateElement('dispalyof_module', '');
    updateElement('show_graph_display', '');
    document.querySelectorAll('[id^="show_module_number"]').forEach(e => e.innerHTML = '');
    
    // Hide content, show login
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.querySelectorAll('.card').forEach(card => {
            card.style.display = card.classList.contains('login-section') ? '' : 'none';
        });
    }
}

function calcCoordinates(sides, radius) {
    const angle = Math.PI / (sides / 2);
    let coord = [];
    for (let i = 0; i < sides; i++) {
        coord.push({ 
            x: Math.round(radius * Math.cos(angle * i)), 
            y: Math.round(radius * Math.sin(angle * i)) 
        });
    }
    return coord;
}

function renderGraph(skills) {
    const c = colors.skill;
    
    // Create the axis lines and scale markers
    let res = calcCoordinates(skills.length, 600).map(item => 
        `<line x1="0" y1="0" x2="${item.x}" y2="${item.y}" stroke="${c.line}" stroke-width="2" />`
    ).join('');
    
    [20, 40, 60, 80, 100].forEach(r => {
        let points = calcCoordinates(skills.length, 600 * r / 100).map(item => `${item.x},${item.y}`).join(' ');
        res += `<polygon points="${points}" stroke="${c.line}" stroke-opacity="0.3" fill="none" />`;
    });

    // Add labels and data points
    const labelCoord = calcCoordinates(skills.length, 780);
    let last = '';
    const points = skills.map((skill, index) => {
        const point = calcCoordinates(skills.length, 600 * skill.level / 100)[index];
        
        // Add point with tooltip
        last += `<circle cx="${point.x}" cy="${point.y}" r="8" fill="${c.point}">
            <title>${skill.name}: ${skill.level}%</title></circle>`;
        
        // Add label
        last += `<text x="${labelCoord[index].x}" y="${labelCoord[index].y}" text-anchor="middle" 
            fill="${c.text}" dominant-baseline="central" font-size="3.5em" font-weight="500">
            <title>${skill.name} ${skill.level}%</title>${skill.name}</text>`;
        
        return `${point.x},${point.y}`;
    }).join(" ");

    // Add data polygon and return SVG
    res += `<polygon points="${points}" fill="${c.polygon}" stroke="${c.stroke}" stroke-width="2" />` + last;
    return `<svg width="100%" height="100%" viewBox="-1000 -1000 2000 2000" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0,0)">${res}</g></svg>`;
}

// Format XP values
function formatXp(xp) {
    return xp > 999 ? (xp / 1000).toFixed(1) + " KB" : xp.toFixed(0) + " B";
}

function module(projects) {
    const c = colors.module;
    const start = new Date(projects[0].createdAt);
    const end = new Date(projects[projects.length - 1].createdAt);
    const duration = end - start;
    const maxXp = projects.reduce((sum, item) => sum + item.xp, 0);
    
    // Update the total XP display outside the graph
    updateElement('show_total_xp', `Total XP: ${formatXp(maxXp)}`);
    
    // Calculate position based on time
    const getTimePosition = date => ((new Date(date) - start) / duration) * 900;
    
    // Generate time markers
    function generateTimeMarkers() {
        let markerLines = '', months = [];
        let currentDate = new Date(start);
        
        while (currentDate <= end) {
            if (currentDate.getDate() === 1 || months.length === 0) {
                const x = getTimePosition(currentDate);
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate);
                markerLines += `<line x1="${x}" y1="0" x2="${x}" y2="310" stroke="${c.grid}" stroke-width="1" />`;
                markerLines += `<text x="${x + 5}" y="324" text-anchor="start" fill="${c.text}" font-size="9">${monthName}</text>`;
                months.push(currentDate);
            }
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(currentDate.getMonth() + 1);
            nextMonth.setDate(1);
            currentDate = nextMonth;
        }
        return markerLines;
    }
    
    // Update module scale numbers
    [0, 1, 2, 3, 4, 5].forEach(i => {
        const el = $(`show_module_number_${i}`);
        if (el) el.innerHTML = i === 0 ? "0 B" : formatXp(maxXp * i / 5);
    });
    
    // Build SVG content
    let svgContent = `<g class="grid">
        ${[310, 248, 186, 124, 62].map(y => `<line x1="0" y1="${y}" x2="900" y2="${y}" stroke="${c.grid}" stroke-width="1" />`).join('')}
        ${generateTimeMarkers()}
    </g>`;
    
    // Create path data and points
    let pathData = 'M0,310 ', dataPoints = '', totalXp = 0;
    
    projects.forEach(p => {
        totalXp += p.xp;
        let x = getTimePosition(p.createdAt);
        let y = 310 - ((totalXp / maxXp) * 310);
        pathData += `L${x},${y} `;
        
        dataPoints += `<circle cx="${x}" cy="${y}" r="6" fill="${c.point}" stroke="#fff" stroke-width="2">
            <title>${p.project} - ${formatXp(p.xp)} - ${new Date(p.createdAt).toLocaleDateString()}</title>
        </circle>`;
    });
    
    // Complete path and add data
    pathData += `L${getTimePosition(end)},310 Z`;
    svgContent += `
        <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${c.polygon};stop-opacity:0.7" />
                <stop offset="100%" style="stop-color:${c.polygon};stop-opacity:0.1" />
            </linearGradient>
        </defs>
        <path d="${pathData}" fill="url(#progressGradient)" stroke="${c.stroke}" stroke-width="2" />
        ${dataPoints}
        ${[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => 
            `<text x="5" y="${i === 0 ? 310 : i === 5 ? 15 : 310 - 62*i}" text-anchor="start" 
            fill="${c.text}" font-size="12">${formatXp(maxXp * ratio)}</text>`).join('')}
    `;
    
    return svgContent;
}

async function loadPage() {
    const graph = await new Data().init();
    const profile = await new Profile().init();
    
    if (graph) {
        updateElement('show_module_nodata', '');
        updateElement('show_module_time', 
            `${graph.moduleStartAt.toLocaleDateString()} -> ${graph.moduleEndAt.toLocaleDateString()}`);
        updateElement('dispalyof_module', module(graph.projects));
        
        // Update skills graph
        if (graph.skills.length) {
            const graphDisplay = $('show_graph_display');
            if (graphDisplay) {
                if (graph.skills.length < 10) {
                    graphDisplay.innerHTML = renderGraph(graph.skills);
                } else {
                    const midpoint = Math.floor(graph.skills.length / 2);
                    graphDisplay.innerHTML = renderGraph(graph.skills.slice(0, midpoint)) + 
                                            renderGraph(graph.skills.slice(midpoint));
                }
            }
        }
        
        updateElement('show_last_transactions', graph.renderTransactions());
    }
    
    if (profile) {
        const total_audit = Number(profile.auditsSucceeded) + Number(profile.auditsFailed);
        const nameElem = $('show_Name');
        if (nameElem) {
            nameElem.innerHTML = `${profile.firstName} ${profile.lastName}` || "Name";
            nameElem.title = profile.login || "Name";
        }
        
        updateElement('show_audit_ratio', profile.auditRatio?.toFixed(2) || "audit_ratio");
        updateElement('show_audit_total', total_audit || "audit_total");
        updateElement('show_audit_successRate', ((profile.auditsSucceeded / total_audit) * 100).toFixed(1) + "%" || "audit_successRate");
        updateElement('show_audit_failRate', ((profile.auditsFailed / total_audit) * 100).toFixed(1) + "%" || "audit_failRate");
        updateElement('show_level', profile.level || "level");
    }
}

// Authentication and initialization
const AUTH_URL = 'https://learn.zone01oujda.ma/api/auth/signin';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');

    // Hide all content except login by default
    ['show_Name', 'logout_btn'].forEach(id => setDisplay(id, 'none'));
    mainContent?.querySelectorAll('.card').forEach(card => {
        card.style.display = card.classList.contains('login-section') ? '' : 'none';
    });
    
    // Set up event listeners
    $('logout_btn')?.addEventListener('click', logout);
    
    $('login_form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = $('login_form');
        const credentials = {
            username: form?.username.value,
            password: form?.password.value
        };
        
        try {
            const res = await fetch(AUTH_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${btoa(credentials.username + ":" + credentials.password)}`
                }
            });
            
            if (!res.ok) {
                const body = await res.json();
                throw new Error('Failed to log in\n' + (body.error || ''));
            }
            
            const token = await res.json();
            if (token.error) throw new Error(token.error);
            localStorage.setItem('token', token);
            
            // Show content, hide login
            mainContent?.querySelectorAll('.card').forEach(card => {
                card.style.display = card.classList.contains('login-section') ? 'none' : '';
            });
            
            // Show header elements
            ['show_Name', 'logout_btn'].forEach(id => setDisplay(id, ''));
            loadPage();
        } catch (error) {
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.textContent = error.message;
            errorMsg.style.color = 'red';
            errorMsg.style.marginTop = '1rem';
            errorMsg.className = 'login-error';
            
            const existingError = form?.querySelector('.login-error');
            if (existingError) existingError.textContent = error.message;
            else form?.appendChild(errorMsg);
        }
    });
    
    // Check for existing token
    if (localStorage.getItem('token')) {
        mainContent?.querySelectorAll('.card').forEach(card => {
            card.style.display = card.classList.contains('login-section') ? 'none' : '';
        });
        ['show_Name', 'logout_btn'].forEach(id => setDisplay(id, ''));
        loadPage();
    }
});

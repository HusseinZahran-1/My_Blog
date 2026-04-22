// Particle Canvas System for both hero and login pages
function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if(!canvas) {
        console.log('Canvas not found:', canvasId);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let animationId;
    
    function resize() { 
        const parent = canvas.parentElement;
        width = parent ? parent.clientWidth : window.innerWidth;
        height = parent ? parent.clientHeight : window.innerHeight;
        canvas.width = width; 
        canvas.height = height; 
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle { 
        constructor() { 
            this.x = Math.random() * width; 
            this.y = Math.random() * height; 
            this.vx = (Math.random() - 0.5) * 0.3; 
            this.vy = (Math.random() - 0.5) * 0.3; 
            this.radius = Math.random() * 2 + 1; 
            this.color = `rgba(124, 58, 237, ${Math.random() * 0.5 + 0.2})`; 
        } 
        update() { 
            this.x += this.vx; 
            this.y += this.vy; 
            if(this.x < 0) this.x = width; 
            if(this.x > width) this.x = 0; 
            if(this.y < 0) this.y = height; 
            if(this.y > height) this.y = 0; 
        } 
        draw() { 
            if(ctx) {
                ctx.beginPath(); 
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
                ctx.fillStyle = this.color; 
                ctx.fill(); 
            }
        } 
    }
    
    // Create particles
    for(let i = 0; i < 70; i++) particles.push(new Particle());
    
    function drawLines() { 
        if(!ctx) return;
        for(let i = 0; i < particles.length; i++) { 
            for(let j = i + 1; j < particles.length; j++) { 
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy); 
                if(dist < 120) { 
                    ctx.beginPath(); 
                    ctx.moveTo(particles[i].x, particles[i].y); 
                    ctx.lineTo(particles[j].x, particles[j].y); 
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist/120)})`; 
                    ctx.stroke(); 
                } 
            } 
        } 
    }
    
    function animate() { 
        if(!ctx) return; 
        ctx.clearRect(0, 0, width, height); 
        particles.forEach(p => { 
            p.update(); 
            p.draw(); 
        }); 
        drawLines(); 
        animationId = requestAnimationFrame(animate); 
    }
    
    animate();
    
    // Return cleanup function
    return function cleanup() {
        if(animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
    };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => { 
    // Initialize hero canvas if it exists
    if(document.getElementById('heroCanvas')) {
        initCanvas('heroCanvas');
    }
    // Initialize login canvas if it exists
    if(document.getElementById('loginCanvas')) {
        initCanvas('loginCanvas');
    }
});
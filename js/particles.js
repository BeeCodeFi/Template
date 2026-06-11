/* ============================================
   PARTICLES.JS — tsParticles WebGL Background
   ============================================ */

window.initParticles = function () {
    // Skip heavy particle system on mobile — saves battery and prevents OOM on low-end devices
    if (window.innerWidth <= 768) return;

    const theme = document.documentElement.getAttribute('data-theme');
    const isDark = theme === 'dark';

    const particleColor = isDark ? '#ffffff' : '#4a4a6a';
    const linkColor = isDark ? '#7B2FFF' : '#6B1FEF';
    const bgColor = 'transparent';

    if (typeof tsParticles === 'undefined') return;

    tsParticles.load('particles-bg', {
        fullScreen: false,
        background: {
            color: bgColor
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab'
                },
                onClick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5,
                        color: linkColor
                    }
                },
                push: {
                    quantity: 3
                }
            }
        },
        particles: {
            color: {
                value: [particleColor, '#7B2FFF', '#00F5FF']
            },
            links: {
                color: linkColor,
                distance: 150,
                enable: true,
                opacity: isDark ? 0.15 : 0.1,
                width: 1
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce'
                },
                random: true,
                speed: 0.8,
                straight: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            },
            number: {
                density: {
                    enable: true,
                    area: 900
                },
                value: window.innerWidth < 768 ? 40 : 80
            },
            opacity: {
                value: {
                    min: 0.2,
                    max: 0.7
                },
                animation: {
                    enable: true,
                    speed: 0.5,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            shape: {
                type: ['circle', 'triangle']
            },
            size: {
                value: {
                    min: 1,
                    max: 3
                },
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 0.5,
                    sync: false
                }
            },
            twinkle: {
                particles: {
                    enable: true,
                    frequency: 0.03,
                    opacity: 1,
                    color: {
                        value: '#00F5FF'
                    }
                }
            }
        },
        detectRetina: true
    });
};

// Initialize when tsParticles is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.initParticles, 100);
    });
} else {
    setTimeout(window.initParticles, 100);
}

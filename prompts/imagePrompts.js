const imagePrompts = {
    'index-hero': {
        1: {
            prompt: "I need images that convey a futuristic aesthetic related to automotive design, with a specific focus on various automotive components. Please ensure that the images highlight innovative features, advanced materials, and cutting-edge technology. The composition should emphasize the intricate details and functionalities of each component, creating a visually striking representation that captures the essence of modern automotive engineering. Output size 1700x3000px, wide banner format with 1:1.8 aspect ratio."
        },
        2: {
            prompt: "I need images that convey a futuristic aesthetic related to automotive design, with a specific focus on various automotive components. Please ensure that the images highlight innovative features, advanced materials, and cutting-edge technology. The composition should emphasize the intricate details and functionalities of each component, creating a visually striking representation that captures the essence of modern automotive engineering. Output size 1700x3000px, wide banner format with 1:1.8 aspect ratio."
        },
        3: {
            prompt: "I need images that evoke a futuristic aesthetic related to automotive design, specifically emphasizing various automotive components. Please ensure that the images showcase innovative designs, advanced materials, and cutting-edge technology, highlighting the intricate details and functionalities of each component in a visually striking manner. Output size 1700x3000px, wide banner format with 1:1.8 aspect ratio."
        }
    },

    'index-introduce': {
        1: {
            prompt: "Detailed view of next-generation automotive component assembly, featuring AI-driven robotic systems and precision quality control. Emphasize the integration of smart manufacturing technologies. Output size 1235x1235px, perfect square format."
        },
        2: {
            prompt: "International team of engineers collaborating on innovative automotive solutions, showcasing global expertise and cultural diversity. Include holographic displays and advanced design tools. Output size 1380x2460px, wide format with 1:1.8 aspect ratio."
        },
        3: {
            prompt: "State-of-the-art quality assurance laboratory with advanced testing equipment and automated inspection systems. Focus on precision measurement and data analytics. Output size 1380x2460px, wide format with 1:1.8 aspect ratio."
        }
    },

    'company-overview': {
        1: {
            prompt: "Bird's-eye view of an ultra-modern manufacturing facility showcasing sustainable architecture, solar integration, and smart factory elements. Emphasize the scale and technological advancement. Output size 2700x1500px, vertical format with 1.8:1 aspect ratio."
        },
        2: {
            prompt: "Multi-cultural team of professionals collaborating in an innovative workspace, featuring advanced visualization tools and interactive displays. Show global connectivity and teamwork. Output size 2700x1500px, vertical format with 1.8:1 aspect ratio."
        },
        3: {
            prompt: "Cutting-edge R&D center with various testing facilities, prototype development areas, and collaborative spaces. Highlight the fusion of innovation and practical application. Output size 2700x1500px, vertical format with 1.8:1 aspect ratio."
        }
    },

    'vision-card': {
        1: {
            prompt: "I need visually engaging images that represent ISO and IATF certification processes, as well as global cooperation cases. Please ensure that the images effectively illustrate the key concepts of quality management and automotive industry standards. The visuals should depict the certification process, collaboration among international partners, and the impact of these certifications on global business practices. Incorporate elements that highlight the importance of quality assurance and continuous improvement in automotive manufacturing. Output size 3208x1500px, vertical format with 2.1:1 aspect ratio."
        },
        2: {
            prompt: "Please create compelling and reliable images that illustrate successful collaboration stories with key global partners. The visuals should effectively convey the impact of these partnerships on business growth and innovation. Include elements that highlight teamwork, shared goals, and the positive outcomes of collaboration, showcasing how these alliances contribute to achieving mutual success in various industries. Output size 3100x3100px, perfect square format."
        },
        3: {
            prompt: "ISO and IATF certification, global cooperation cases The visual production of images. Output size 3100x3100px, perfect square format."
        },
        4: {
            prompt: "Create high-quality images that depict successful collaboration stories with key global partners. The visuals should emphasize teamwork, effective communication, and shared achievements, showcasing specific projects or outcomes that illustrate the benefits of these partnerships in driving innovation and business growth. Output size 3100x3100px, perfect square format."
        }
    },

    'history-hero': {
        prompt: "Create an engaging timeline showcasing the evolution of automotive manufacturing technology, from traditional methods to Industry 4.0. Feature key innovations, technological breakthroughs, and future projections. Output size 2048x4276px, wide banner format with 1:2.1 aspect ratio."
    },

    'history-image': {
        prompt: "Create reliable images through collaboration success stories with key global partners. First image: 1960x4036px wide banner, following images: 3304x3304px perfect square format."
    },

    'future-vision': {
        prompt: "Create a futuristic, technological, and innovative-looking car design that features a front view, showcasing the front of the vehicle in a straightforward composition. Please include references for inspiration. Output size 2000x3500px, wide format with 1:1.75 aspect ratio."
    },

    'technology-hero': {
        prompt: "Showcase advanced manufacturing technologies with a focus on smart automation, AI integration, and precision engineering. Highlight the convergence of traditional manufacturing excellence with cutting-edge digital solutions. Output size 816x1456px, vertical format with 1:1.8 aspect ratio."
    },

    'news-hero': {
        prompt: "Modern corporate environment featuring global collaboration spaces, technology demonstrations, and professional networking events. Emphasize international partnerships and innovative project presentations. Output size 1900x3500px, wide banner format with 1:1.8 aspect ratio."
    },

    'electronics': {
        prompt: "Create a futuristic, technological, and innovative-looking car component design that features a front view, showcasing engine of vehicle. Please include references for inspiration. Output size 2550x3550px, wide format with 1:1.4 aspect ratio."
    },

    'cnc': {
        prompt: "Create a visually appealing design for the CNC Business Division that reflects a futuristic and technological look. Highlight advanced technologies, automation, and precision engineering. Emphasize innovation and efficiency, showcasing how the division is poised to lead in the future of manufacturing. Output size 2680x3500px, wide format with 1:1.3 aspect ratio."
    }
};

// 이미지 생성을 위한 공통 스타일 가이드라인
const styleGuide = {
    commonStyle: "Professional, modern, clean, high-tech appearance with futuristic elements",
    lighting: "Cool, blue-tinted industrial lighting with dramatic contrasts and highlights",
    quality: "Ultra-high resolution, sharp details, professional composition with emphasis on technological elements",
    tone: "Forward-looking, innovative, and professional atmosphere",
    perspective: "Dynamic angles, showing depth and scale, with emphasis on technical details",
    colors: "Predominant colors: blue, silver, white with technological accents and occasional warm highlights",
    consistency: "Maintain visual consistency across variations while showing different aspects of the subject, emphasizing innovation and precision"
};

// 프롬프트 생성 헬퍼 함수
function generateFullPrompt(basePrompt) {
    return `${basePrompt}. ${styleGuide.commonStyle}. ${styleGuide.lighting}. ${styleGuide.quality}. ${styleGuide.consistency}`;
}

// 특정 타입의 프롬프트 가져오기
function getPrompt(type, variant) {
    const promptSet = imagePrompts[type];
    if (!promptSet) {
        throw new Error(`Unknown prompt type: ${type}`);
    }
    
    // 시리즈 프롬프트 가져오기
    if (promptSet[variant] && promptSet[variant].prompt) {
        return generateFullPrompt(promptSet[variant].prompt);
    }
    
    // 단일 프롬프트 가져오기
    if (promptSet.prompt) {
        return generateFullPrompt(promptSet.prompt);
    }
    
    throw new Error(`No prompt found for: ${type}-${variant}`);
}

module.exports = {
    imagePrompts,
    styleGuide,
    getPrompt
}; 
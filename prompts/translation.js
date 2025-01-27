const axios = require('axios');

async function translateContent(content, targetLang) {
    try {
        // HTML 태그 보존
        const taggedContent = content.replace(
            /(<[^>]+>.*?<\/[^>]+>|<[^/>]+\/>)/g,
            match => `__TAG__${Buffer.from(match).toString('base64')}__TAG__`
        );
        
        // API 요청 (예: OpenAI API)
        const response = await axios.post(process.env.TRANSLATION_API_URL, {
            text: taggedContent,
            target_language: targetLang
        });
        
        // 태그 복원
        const translatedContent = response.data.replace(
            /__TAG__([A-Za-z0-9+/=]+)__TAG__/g,
            (_, encoded) => Buffer.from(encoded, 'base64').toString()
        );
        
        return translatedContent;
    } catch (error) {
        console.error('Translation failed:', error);
        throw error;
    }
}

const translationPrompt = `Role: 자동차 산업 전문 테크니컬 번역가

Task: 휴먼플러스 웹사이트 콘텐츠의 번역

Guidelines:
1. 엄격한 JSON 형식 규칙:
   - 모든 키와 값은 반드시 큰따옴표(")로 감싸야 합니다
   - 작은따옴표('), 스마트 따옴표('), 기타 유니코드 따옴표는 절대 사용 금지
   - 마지막 항목을 제외한 모든 항목 뒤에는 콤마(,) 필수
   - 중괄호({})와 대괄호([])는 정확한 위치에 배치
   - 모든 키는 원본 그대로 유지하고 절대 번역하지 않음
   - 모든 값은 반드시 문자열이어야 함 (숫자, 불리언, null 사용 금지)

2. 특수문자 제한:
   - 허용된 특수문자만 사용:
     * HTML 태그: <, >, /
     * JSON 구조: {, }, [, ], ", :, ,
     * 문장 부호: ., -
   - 금지된 특수문자:
     * &, #, %, $, @, !, ?, ~, ^, *, (, ), _, +, =, |, \\, ;
     * 이모지, 유니코드 특수문자
   - 앰퍼샌드(&)는 반드시 HTML 엔티티(&amp;)로 변환

3. HTML 태그 규칙:
   - 허용된 태그만 사용: <strong>, <br>, <span>
   - 다른 HTML 태그는 절대 사용 금지
   - 태그는 반드시 열고 닫아야 함
   - 태그 속성 사용 금지 (class, style 등)
   - 태그 중첩 사용 금지
   - 태그 내부 불필요한 공백 금지

4. 텍스트 콘텐츠 규칙:
   - 번역된 언어의 문자와 영문만 사용
   - 숫자는 필요한 경우에만 사용 (연도, 수치 등)
   - 줄바꿈은 <br> 태그로만 처리
   - 불필요한 공백이나 탭 제거
   - 각 언어의 문장 부호 규칙 준수

5. 필수 유지 항목:
   - 'index-hero-title-random-keyword1'과 'index-hero-title-random-keyword2'는 영어 단어 그대로 유지
   - 회사명 'Human Plus', 'HUMAN PLUS'는 번역하지 않음
   - 기술 용어(SMT, PBA, CNC 등)는 원어 그대로 유지
   - HTML 태그의 위치와 구조는 정확히 유지

5. 번역 품질 기준:
   - 해당 언어의 문법 규칙 준수
   - 기술 용어의 공식 번역어 사용
   - 일관된 어조와 스타일 유지
   - 자연스러운 문장 구조

6. 필수 포함 키 목록:
   - random-vision-text
   - vision-card-random-text-1
   - vision-card-random-text-2
   - vision-card-random-text-3
   - vision-card-random-text-4
   - index-hero-title-random-keyword1
   - index-hero-title-random-keyword2
   - index-hero-random-description
   - index-introduce-random-description
   - index-card-introduce-random-description
   - index-collaboration-random-description
   - technology-hero-random-description
   - news-highlight-random-description
   - history-content-random-title

검증 단계:
1. JSON 형식 검증
   - 모든 키와 값이 큰따옴표로 감싸져 있는지 확인
   - 콤마 위치가 정확한지 확인
   - 중괄호 열고 닫기가 정확한지 확인

2. 특수문자 검증
   - 허용되지 않은 특수문자가 있는지 확인
   - 앰퍼샌드가 HTML 엔티티로 변환되었는지 확인

3. HTML 태그 검증
   - 허용된 태그만 사용되었는지 확인
   - 태그가 올바르게 열고 닫혔는지 확인
   - 속성이 없는지 확인

4. 콘텐츠 검증
   - 필수 유지 항목이 보존되었는지 확인
   - 불필요한 공백이 제거되었는지 확인
   - 모든 필수 키가 포함되었는지 확인

5. 텍스트 품질 최종 검증:
   - 각 문장을 개별적으로 검토하여 자연스러운 표현인지 확인
   - 해당 언어의 문법적 오류가 없는지 검토
   - 띄어쓰기가 해당 언어의 규칙에 맞는지 확인
   - 전문 용어가 해당 산업에서 통용되는 표현인지 검토
   - 문장 간의 연결이 자연스러운지 확인
   - 전체적인 문맥이 원문의 의도를 정확히 전달하는지 검토

Example Output Format:
{
    "random-vision-text": "Advancing through continuous research<br>for a better future",
    "vision-card-random-text-1": "Global leader in electronic parts market",
    "vision-card-random-text-2": "Production focused on high-precision processing technology",
    "vision-card-random-text-3": "Global certification and technical innovation",
    "vision-card-random-text-4": "Leading global market partnerships",



    "index-hero-random-description": "Human Plus<br>leads the way with<br>customer-centric technology and<br>detailed process management",
    "index-introduce-random-description": "Human Plus leads the way with <strong>global trust</strong>, <strong>customer-centric technology</strong>, and <strong>detailed process management</strong>",
    "index-card-introduce-random-description": "A leading automotive parts manufacturer,<br><span>HUMAN PLUS</span> gains<br><strong>customer trust</strong> through<br><strong>continuous innovation</strong> and <strong>quality improvement</strong>",

    "index-collaboration-random-description": "Human Plus maintains its <strong>leading position</strong> through <strong>global trust</strong>, <strong>customer-centric technology</strong>, and <strong>thorough process management</strong>",
    "technology-hero-random-description": "Setting manufacturing standards<br>through customer-centric innovation<br>and precise process management",

    "news-highlight-random-description": "What we create is not just parts<br>It is a chain of trust connecting the world<br>Human Plus designs tomorrow of the global automotive industry",
    "history-content-random-title": "Human Plus is global Based on trust, <br>Leading with customer oriented technology <br>and detailed process management"
    "news-highlight-random-description": "What we create is not just parts<br>It is a chain of trust connecting the world<br>Human Plus designs tomorrow of the global automotive industry",
    "history-content-random-title": "Human Plus is global Based on trust, <br>Leading with customer oriented technology <br>and detailed process management"
    "news-highlight-random-description": "What we create is not just parts<br>It is a chain of trust connecting the world<br>Human Plus designs tomorrow of the global automotive industry",
    "history-content-random-title": "Human Plus is global Based on trust, <br>Leading with customer oriented technology <br>and detailed process management"
    "index-collaboration-random-description": "Human Plus는 <strong>글로벌 신뢰</strong>, <strong>고객 중심 기술</strong>, <strong>철저한 공정 관리</strong>로 <strong>선도적 위치</strong>를 유지합니다",
    "technology-hero-random-description": "고객 중심의 혁신과<br>정밀한 공정 관리를 통해<br>제조 기준을 만들어갑니다",
    "news-highlight-random-description": "우리가 만드는 것은 단순한 부품이 아닙니다<br>세계를 연결하는 신뢰의 고리입니다<br>Human Plus는 글로벌 자동차 산업의 내일을 설계합니다",
    "history-content-random-title": "Human Plus는 신뢰를 바탕으로 글로벌화를 이루고<br>고객 중심 기술과 세밀한 공정 관리로<br>앞서나갑니다"
}`;

module.exports = translationPrompt; 
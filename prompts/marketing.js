const marketingPrompt = `Role: 자동차 부품 제조 기업 전문 마케팅 카피라이터
Task: 휴먼플러스(자동차 부품 제조 기업)의 웹사이트 콘텐츠 생성

Guidelines:
제가 드릴 JSON 형식의 문구 목록 및 예시를 참고하여,
1. 기존과 동일한 JSON 구조(키/값 형태)를 그대로 유지하고,
2. 원본 예시와 유사한 글자 수와 문장 형식을 적용하며,
3. 고객의 관심을 끌 수 있는 매력적인 문구로 리라이팅해주십시오.

4. 엄격한 JSON 형식 규칙:
   - 모든 키는 큰따옴표(")로 감싸야 합니다
   - 모든 값도 큰따옴표(")로 감싸야 합니다
   - 작은따옴표(')는 절대 사용하지 마세요
   - 콤마(,)는 마지막 항목을 제외한 모든 항목 뒤에 필요합니다
   - 중괄호({})와 대괄호([])는 정확한 위치에 있어야 합니다
   - 이스케이프 문자(\)는 사용하지 마세요
   - 특수문자나 이모지는 사용하지 마세요

5. HTML 태그 규칙:
   - 허용된 태그만 사용: <strong>, <br>, <span>
   - 다른 HTML 태그는 절대 사용하지 마세요
   - 태그는 반드시 열고 닫아야 합니다
   - 태그 속성은 사용하지 마세요 (class, style 등 금지)
   - 태그는 중첩해서 사용하지 마세요
   - 태그 내부에 불필요한 공백을 넣지 마세요

6. 텍스트 콘텐츠 규칙:
   - 한글과 영문만 사용 (특수문자 사용 금지)
   - 숫자는 필요한 경우에만 사용
   - 줄바꿈은 <br> 태그로만 처리
   - 불필요한 공백이나 탭은 제거

7. 톤앤매너:
   - 전문성과 신뢰성 강조
   - 글로벌 기업의 이미지 표현
   - 기술력과 혁신 강조
   - 간결하고 명확한 메시지

이 모든 요구사항에 따라, 
- 문구 자체의 뉘앙스와 어조가 좀 더 전문적이고 동시에 친근하게 느껴지도록 
- 고객에게 제품의 경쟁력과 신뢰감을 전달할 수 있도록 
작성해주시면 감사하겠습니다.

주의사항:
- 기술 용어의 정확성 유지
- 글로벌 비즈니스 관점 반영
- B2B 커뮤니케이션 스타일 유지
- 브랜드 일관성 유지

아래의 JSON 형식을 바탕으로 결과를 제시해주시기 바랍니다.

추가 품질 검증 기준:
1. 텍스트 자연스러움 검증:
   - 각 문장이 한국어 문법에 맞게 작성되었는지 확인
   - 문장 간의 자연스러운 연결 확인
   - 전체적인 문맥의 일관성 검토
   - 불필요한 반복이나 어색한 표현 제거

2. 띄어쓰기 규칙 검증:
   - 조사의 올바른 띄어쓰기 확인
   - 의존명사의 띄어쓰기 확인
   - 합성어와 파생어의 띄어쓰기 규칙 준수
   - 고유명사와 일반명사의 띄어쓰기 구분

3. 전문성 검증:
   - 자동차 산업 전문 용어의 정확한 사용
   - B2B 커뮤니케이션에 적합한 어조 유지
   - 기술적 정확성과 전문성 확보
   - 업계 표준 용어 사용 확인

4. 마케팅 효과성 검증:
   - 메시지의 명확성과 설득력 확인
   - 타겟 고객층에 적합한 표현 사용
   - 브랜드 가치 전달력 검토
   - 차별화 포인트 강조 여부 확인

검증 프로세스:
1. 초안 작성 후 각 문장 단위 검토
2. 문단 간 연결성 및 문맥 검토
3. 띄어쓰기 및 문법 규칙 준수 여부 확인
4. 전문 용어 사용의 적절성 검토
5. 전체적인 마케팅 메시지의 효과성 평가
6. 최종 품질 검증 및 수정

Example Input/Output Format:
{
    "random-vision-text": "더 나은 미래를 위해<br>끊임없이 연구하며 성장합니다",
    "vision-card-random-text-1": "글로벌 전장 시장의 선도주자",
    "vision-card-random-text-2": "고정밀 가공기술 중심 설비 생산",
    "vision-card-random-text-3": "글로벌 인증과 기술 혁신",
    "vision-card-random-text-4": "세계 시장을 선도하는 파트너십",

    "index-hero-title-random-keyword1": "Connect",
    "index-hero-title-random-keyword2": "Global",
    "index-hero-random-description": "Human Plus는<br>글로벌 신뢰를 바탕으로<br>고객 중심의 기술과 세밀한<br>공정 관리로 앞서 나갑니다",
    "index-introduce-random-description": "Human Plus는 <strong>글로벌 신뢰</strong>를 바탕으로 <strong>고객 중심의 기술</strong>과 <strong>세밀한 공정 관리</strong>로 앞서 나갑니다",
    "index-card-introduce-random-description": "자동차 부품 제조의 선도 기업,<br><span>HUMAN PLUS</span>는<br><strong>끊임없는 혁신</strong>과 <strong>품질 향상</strong>으로<br><strong>고객 신뢰</strong>를 얻고 있습니다",

    "index-collaboration-random-description": "Human Plus는 <strong>세계적인 신뢰</strong>를 바탕으로 <strong>고객 중심의 기술</strong>과 <strong>철저한 공정 관리</strong>를 통해 <strong>선도적인 위치</strong>를 유지합니다",
    "technology-hero-random-description": "고객 중심의 기술 혁신과<br>정교한 공정 관리로<br>제조의 표준을 만들어갑니다<br>",

    "news-highlight-random-description": "우리가 만드는 것은 단순한 부품이 아닙니다<br>그것은 전 세계를 연결하는 신뢰의 연결고리입니다<br>휴먼플러스는 글로벌 자동차 산업의 내일을 함께 설계합니다",
    "history-content-random-title": "Human Plus is global Based on trust, <br>Leading with customer oriented technology <br>and detailed process management"
}`;

module.exports = marketingPrompt; 
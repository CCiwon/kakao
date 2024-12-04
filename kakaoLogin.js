import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise'; // MySQL 연결을 위해 mysql2 사용

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// public 폴더 내 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// POST 요청 처리 설정
app.use(bodyParser.json());

// MySQL 데이터베이스 연결
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL 사용자 이름
    password: '12345678', // MySQL 비밀번호
    database: 'kdt', // MySQL 데이터베이스 이름
});

// API 엔드포인트 - 사용자 정보 저장
app.post('/save-user', async (req, res) => {
    const { id, nickname } = req.body;

    try {
        // 사용자 정보 저장 SQL 쿼리
        const query = `
            INSERT INTO KakaoUsers (kakao_id, nickname)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
                nickname = VALUES(nickname),
                updated_at = CURRENT_TIMESTAMP;
        `;

        // 쿼리 실행
        await db.execute(query, [id, nickname]);
        res.status(200).json({ message: '사용자 정보 저장 성공' });
    } catch (error) {
        console.error('데이터 저장 오류:', error);
        res.status(500).json({ message: '데이터 저장 실패', error });
    }
});

// 서버 실행
app.listen(8080, () => {
    console.log('서버가 8080에서 실행중');
});

export default async function handler(req, res) {
  // POST 방식의 요청만 받습니다 (보안)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { content } = req.body;
  const token = process.env.GH_TOKEN; // 방금 Vercel에 저장한 그 이름표!

  const owner = 'ssd2am';
  const repo = 'ssd2am.github.io';
  const path = 'now.json';

  try {
    // 현재 파일 정보를 가져와서 SHA(버전 체크용)를 확보합니다.
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 'Authorization': `token ${token}` }
    });
    const fileData = await getRes.json();
    const sha = fileData.sha;

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} · ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    const newData = {
      date: dateStr,
      content: content.replace(/\n/g, "<br>")
    };

    // GitHub API로 업데이트 요청 전송
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Update via Vercel Function",
        content: Buffer.from(JSON.stringify(newData, null, 2)).toString('base64'),
        sha: sha
      })
    });

    if (putRes.ok) {
      res.status(200).json({ message: '성공적으로 업데이트되었습니다!' });
    } else {
      res.status(500).json({ message: 'GitHub 서버 응답 에러' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
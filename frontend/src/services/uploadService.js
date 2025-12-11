const UPLOAD_URL = 'http://localhost:3000/api/upload';

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
//check file  owasp file upload cheat sheet
  const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  // returns { url: '/uploads/filename' }, extract just the filename
  const url = data.url;
  const filename = url.split('/').pop(); // extract filename from '/uploads/filename'
  return filename;
}

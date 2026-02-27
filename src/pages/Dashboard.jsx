import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [resumes, setResumes] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  useEffect(() => { fetchResumes() }, [])

  const fetchResumes = async () => {
    try {
      const res = await axios.get('https://resume-analyzer-backend-pm3i.onrender.com/api/resume/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResumes(res.data)
    } catch (err) { console.log(err) }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setAnalysis('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await axios.post('https://resume-analyzer-backend-pm3i.onrender.com/api/resume/analyze', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setAnalysis(res.data.analysis)
      fetchResumes()
    } catch (err) { console.log(err) }
    setLoading(false)
  }

  const handleLogout = () => { localStorage.clear(); navigate('/login') }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      fontFamily: "'Segoe UI', sans-serif",
      color: 'white'
    }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📄</span>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>Resume Analyzer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>👋 {user?.name}</span>
          <button onClick={handleLogout} style={{
            padding: '8px 20px',
            background: 'rgba(255,100,100,0.2)',
            border: '1px solid rgba(255,100,100,0.3)',
            borderRadius: '10px',
            color: '#ff6b6b',
            cursor: 'pointer',
            fontWeight: '600'
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Upload Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>🤖 AI Resume Analysis</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Upload your resume and get instant AI-powered feedback</p>

          <form onSubmit={handleAnalyze}>
            <label style={{
              display: 'block',
              border: '2px dashed rgba(99,102,241,0.5)',
              borderRadius: '16px',
              padding: '32px',
              cursor: 'pointer',
              marginBottom: '20px',
              background: 'rgba(99,102,241,0.05)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📁</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                {file ? `✅ ${file.name}` : 'Click to upload your resume'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>PDF or TXT supported</div>
              <input type="file" accept=".txt,.pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
            </label>

            <button type="submit" disabled={loading || !file} style={{
              padding: '14px 40px',
              background: loading || !file ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}>
              {loading ? '🔄 Analyzing...' : '✨ Analyze Resume'}
            </button>
          </form>
        </div>

        {/* Analysis Result */}
        {analysis && (
          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#a5b4fc' }}>
              ✨ Analysis Result
            </h3>
            <pre style={{
              whiteSpace: 'pre-wrap',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.8',
              fontSize: '14px',
              fontFamily: "'Segoe UI', sans-serif"
            }}>{analysis}</pre>
          </div>
        )}

        {/* Past Analyses */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
            📊 Past Analyses ({resumes.length})
          </h3>
          {resumes.length === 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.3)'
            }}>
              No analyses yet — upload your first resume!
            </div>
          )}
          {resumes.map(r => (
            <div key={r._id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: '600', color: '#a5b4fc' }}>📄 {r.filename}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <pre style={{
                whiteSpace: 'pre-wrap',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                lineHeight: '1.7',
                fontFamily: "'Segoe UI', sans-serif"
              }}>{r.analysis}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
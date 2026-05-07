# ⚖️ GeoLegal — India's Law. Your Rights.

> **Know the law before it finds you.**  
> AI-powered legal awareness for people relocating across Indian states.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)](https://openai.com)
[![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00E5FF?style=flat-square&logo=postgresql)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What is GeoLegal?

14 million Indians relocate between states every year.
Most do not know that local laws differ drastically — and they pay for it in fines, arrests, and false accusations.

GeoLegal** is an AI legal awareness chatbot that tells you exactly what is legal, what is not, and what the penalty is 
— specific to the Indian state you are in. It covers IPC sections, state-specific amendments, union territory laws, and constitutional rights
— in plain English and 22 Indian languages.

---


| Landing Page | Chat Interface | Trap Laws |
|---|---|---|
| India's Law. Your Duties. | Multi-language AI chat | Laws misused against outsiders |
| 500+ IPC Sections · 36 Jurisdictions | Bihar laws active · Voice enabled | EXTREME RISK warnings |

---

## Key Features

### 🤖 AI Legal Chat
- Powered by **GPT-4o** with real-time voice using **WebRTC full-duplex**
- Answers grounded in verified state-specific legal documents
- **22 Indian languages** — Hindi, Bengali, Hinglish, Telugu, Marathi, Tamil, and more
- Auto-detects user language and responds accordingly

### ⚠️ Trap Laws — Know Before You Go
The most unique feature on the platform. GeoLegal surfaces laws that are **frequently misused against innocent people** 
— especially those coming from other states.

Real laws. Real risk. Real protection:
- **POCSO Act** — How accidental contact with a minor can lead to immediate arrest
- **SC/ST Atrocities Act** — How any dispute can become a criminal case without investigation
- **Section 498A IPC** — How distant relatives get named in dowry harassment FIRs
- **Bihar Prohibition Act** — How a sealed bottle from another state means 5 years imprisonment
- **Land Encroachment** — How tenants with valid agreements still get falsely arrested

Each trap law includes: what the law is, how it is misused, a real example, how to protect yourself, and the key legal judgment that defends you.

### 🚨 Police Encounter SOS
One tap. Full screen emergency guide showing:
- Your rights during arrest (Article 22, Section 50 CrPC)
- What to say and what never to say
- Clickable emergency numbers (Police 100, Legal Aid 15100)
- Key Supreme Court judgments that protect you (Arnesh Kumar 2014, D.K. Basu Guidelines)



## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| HTTP Client | Axios |

### Backend
| Layer | Technology |
|---|---|
| API Framework | FastAPI (Python) |
| Server | Uvicorn (ASGI) |
| Auth | JWT + Redis session cache (1-week retention) |
| Voice | OpenAI Realtime Voice API (WebRTC full-duplex) |
| Context | FAISS inline context management |

### AI & Data
| Layer | Technology |
|---|---|
| LLM | GPT-4o (OpenAI) |
| Search | Web search + local legal document retrieval |
| Token Optimization | Indigenous caveman skill for free-tier efficiency |
| Language Detection | Auto-detect across 22 Indian languages |

### Database
| Layer | Technology |
|---|---|
| Primary DB | **NeonDB** (PostgreSQL — serverless) |
| Session Cache | **Redis** (1-week login retention) |
| Schema | 4 tables: `user_info`, `chats`, `messages` (JSONB), `saved_chats` |
| Security | User-ID pivoted partitioning — zero data leakage between users |

### Architecture
```
End User
   │
   ▼
Landing Page ──► Public Insights ──► Legal Dictionary
              └──► Customized Queries ──► IPC References ◄── Web Search
                                      └──► Local Laws      ◄── OpenAI Voice LLM
   │
   ▼
User Auth ──► User Info ──► NeonDB
   │               └──► Chat Sessions
   ▼               └──► Saved Chats
Chat Interface ◄──────────────────────────► OpenAI Real-Time Voice LLM
```

---


---



### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (NeonDB account)
- Redis
- OpenAI API key

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Add your keys to .env
echo "OPENAI_API_KEY=your_key" >> .env
echo "GROQ_API_KEY=your_key" >> .env
echo "DATABASE_URL=your_neon_db_url" >> .env
echo "REDIS_URL=your_redis_url" >> .env

uvicorn main:app --reload
# API running at http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:3000
```

### API Health Check
```
GET http://localhost:8000/health
→ {"status": "GeoLegal API is running"}
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status |
| `POST` | `/chat` | Legal question answering |
| `POST` | `/fir-checker` | FIR situation analysis |
| `GET` | `/trap-laws` | All trap laws data |
| `GET` | `/law-alert` | Random law of the moment |
| `GET` | `/police-rights` | Police encounter guide |
| `GET` | `/travel-risk/{state}` | Travel risk score |
| `GET` | `/checklist` | Bihar traveller checklist |

---

## Why GeoLegal is Different from ChatGPT

| | ChatGPT | GeoLegal |
|---|---|---|
| State-specific laws | ❌ Generic national answers | ✅ Bihar-specific, filtered answers |
| Risk classification | ❌ None | ✅ Red / Yellow / Green on every answer |
| Penalty amounts | ❌ Vague | ✅ Exact fine from verified legal text |
| Source citation | ❌ None | ✅ Act name and section on every answer |
| Trap Laws awareness | ❌ None | ✅ 5 misused laws with real examples |
| Police encounter guide | ❌ None | ✅ One-tap SOS with clickable numbers |
| Indian languages | ❌ Limited | ✅ 22 languages with voice |
| Real-time voice | ❌ None | ✅ WebRTC full-duplex |
| Built for Indian migrants | ❌ General purpose | ✅ Specifically for state relocation |

---

## Disclaimer

GeoLegal provides **legal awareness only, not legal advice**. For serious legal situations, always consult a qualified lawyer immediately. Emergency legal aid in Bihar: **15100**.

---

## Team

Built with ❤️ for the 14 million Indians who relocate between states every year and deserve to know the law before it finds them.

---

*GeoLegal — Know the law before it finds you.*

# Fake News AI Enhanced Features TODO

Current status: Backend Flask + React UI + Mongo ready. Git fix PR: blackboxai/git-install-fix.

## Approved Enhancement Plan (Proceed step-by-step)

### Phase 1: ML + Sources + Atlas Docs (No keys needed)
- [ ] 1. Update utils.py: RoBERTa model (`cardiffnlp/twitter-roberta-base-fake-gen`), expand TRUSTED_SOURCES (20+).
- [ ] 2. requirements.txt: accelerate.
- [ ] 3. app.py: Load RoBERTa in analyze_text.
- [ ] 4. README.md + .env.example: Atlas setup guide.
- Test: `pip install -r requirements.txt && python app.py`, analyze endpoint.

### Phase 2: Auth (No keys)
- [ ] 5. New auth.py: /register /login (JWT, bcrypt).
- [ ] 6. app.py: JWT protect /analyze /history, users collection.
- [ ] 7. requirements.txt: flask-jwt-extended, bcrypt.
- [ ] 8. Frontend App.js: Login/register form, auth headers/localStorage.

### Phase 3: Screenshots Badges (Google Vision key later)
- [ ] 9. utils.py: screenshot_badge (upload URL → Vision labels → fake/verified score).
- [ ] 10. app.py: Image URL in analyze.
- [ ] 11. Frontend: Image input, badge display.
- [ ] 12. requirements.txt: google-cloud-vision.

### Phase 4: Deploy/Branch
- [ ] 13. New branch blackboxai/enhanced-features.
- [ ] 14. Commit per phase, test, PR to main.
- [ ] 15. Docker Compose (Mongo + app).

## Commands to run:
1. cd fake-news-ai/backend && python -m venv venv && venv\Scripts\Activate.ps1 && pip install -r requirements.txt
2. python app.py  # Test http://localhost:5000/health
3. cd ../frontend && npm start

Updated 2024. Plan approved for autonomous implementation.

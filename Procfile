web: bash -c "cd frontend && npm install && npm run build && cd .. && gunicorn -w 2 -b 0.0.0.0:$PORT run:app"

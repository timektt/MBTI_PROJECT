เวลาจะ Build แบบ Production (build จริง):


ใช้คำสั่งนี้:

docker compose -f docker-compose.yml up -d --build



เวลาจะ Dev (Hot Reload, พัฒนา):


docker compose up -d --build

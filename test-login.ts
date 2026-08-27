import fs from 'fs';
const file = fs.readFileSync('src/components/auth/LoginView.tsx', 'utf8');
const updated = file.replace('const handleLogin = (e: React.FormEvent) => {', `const handleLogin = (e: React.FormEvent) => {
    console.log('Login attempt:', { username, password, users: users.map(u => ({ id: u.id, phone: u.phone, name: u.name })) });`);
fs.writeFileSync('src/components/auth/LoginView.tsx', updated);

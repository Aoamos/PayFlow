## PayFlow - Fintech Digital Wallet System 🏦

A simple backend digital wallet system where users can register, log in, send money, and view balances & transactions.

## 📌 Features

User Authentication with JWT

Wallet Auto-Creation upon registration

Money Transfer between users

View Wallet Balance & Transactions

## 🛠 Tech Stack

Node.js (Backend runtime)

Express.js (Web framework)

MongoDB (Database)

Mongoose (ODM for MongoDB)

JWT (Authentication)

## 📜 API Endpoints

Authentication
POST /auth/register → Register a new user

POST /auth/login → Log in and receive JWT token

## Wallet

GET /wallet → View wallet balance

POST /wallet/transfer → Transfer money to another user

## Transactions

GET /transactions → View transaction history

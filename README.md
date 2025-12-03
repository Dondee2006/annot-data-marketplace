# Annot Data Marketplace

The Ethical African Data Marketplace for the World.
Annot is a global data marketplace where **users and organizations upload data**—text, audio, images, video, and tabular datasets—and **earn token rewards**.
We focus on high-quality, ethically sourced African data to power AI innovation worldwide.

## 🚀 Vision
To become the world’s leading marketplace for **authentic, diverse, high-quality African datasets**, enabling AI companies to build fair, inclusive, and globally representative AI systems.

## 🌍 Why Annot?
AI today is trained mostly on Western or Asian data. Africa’s voices, languages, cultures, and experiences are missing. Annot solves this by:
- Allowing anyone to upload data and **earn tokens**
- Providing companies with **clean, diverse, ethically sourced datasets**
- Offering tools for **annotation, quality evaluation, and dataset licensing**
- Supporting **underrepresented languages and cultures**

## 🧩 How It Works

### 1. **Users Upload Data**
Supported formats:
- Text (.txt, .json)
- Audio (.mp3, .wav)
- Images (.jpg, .png)
- Video (.mp4)
- Tabular (.csv)

### 2. **Automated Data Validation**
The platform performs quality checks and metadata extraction.

### 3. **Token Rewards**
Users earn $ANNOT tokens for uploading approved datasets.
- Base Reward: 5 tokens
- Bonus (>100KB): +2 tokens

### 4. **Buyers Access Datasets**
AI companies and researchers can browse and purchase licenses.

## 🛠️ Features
- 🔗 **Dataset Upload Portal** (Drag & Drop)
- 💰 **Token Reward Mechanism**
- 🔎 **Dataset Search & Discovery**
- 🏦 **Mock Payment System**
- 🔒 **Admin Approval Workflow**

## 🏗️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd annot-data-marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel Project Settings.
4. Deploy!

### Database Setup
Run the SQL commands in `supabase_schema.sql` in your Supabase SQL Editor to set up the tables and functions.

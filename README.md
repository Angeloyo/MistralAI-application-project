# Mistral AI Models Benchmarking

> **Software Engineer Internship Application Project for Mistral AI**  
> Development time: ~2 hours

A web application for benchmarking and comparing different Mistral AI models with automated judging system.

## Features

- **Model Selection**: Choose from Premier and Open Mistral AI models
- **Unified Testing**: Send the same prompt to multiple models simultaneously
- **Dual Judge System**:
  - **Judge 1 (Unbiased)**: Rates each response individually (0-100)
  - **Judge 2 (Biased)**: Rates responses after comparing all outputs
- **Response Management**: View full responses with expand/collapse functionality
- **Real-time Results**: Live updates as models respond and judges evaluate

## Setup

### Prerequisites

- Node.js 18+ and npm
- Mistral AI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mistralai-application-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## Usage

### 1. Set API Key
- Click the settings icon in the top-right corner
- Enter your Mistral AI API key
- The key is stored securely in your browser's local storage

### 2. Select Models
- Choose from available Premier and Open models
- Selected models will be highlighted with checkmarks
- You can select multiple models for comparison

### 3. Enter Test Prompt
- Write your prompt in the text area
- The same prompt will be sent to all selected models
- Click "Run Benchmark" to start the evaluation

### 4. View Results
- **Model Responses**: See responses from each model with response times
- **Judge 1 Scores**: Unbiased individual ratings (0-100)
- **Judge 2 Scores**: Comparative ratings after seeing all responses
- Use "Read more" to expand long responses

## API Usage

The application uses the Mistral AI Chat Completions API:
- **Models**: All responses formatted as plain text
- **Judges**: Use `mistral-medium-2508` for scoring
- **Error Handling**: Graceful handling of API failures

## Architecture

### Components
- `ModelCards`: Model selection interface
- `SettingsModal`: API key management
- `useApiKey`: Local storage hook for API key

### API Functions
- `makeModelCall()`: Execute model requests
- `judgeResponse()`: Individual response scoring
- `judgeResponseWithContext()`: Comparative response scoring

## Judge System

### Judge 1 (Unbiased)
- Evaluates each response individually
- Runs immediately after each model responds
- Criteria: accuracy, clarity, completeness, helpfulness
- No knowledge of other model responses

### Judge 2 (Biased)
- Evaluates responses with full context
- Runs only after all models complete
- Has access to all model outputs for comparison
- Provides comparative scoring

## Contributing

This project was built as part of a Mistral AI Software Engineer Internship application. Feel free to suggest improvements or report issues.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI
- **State Management**: React useState hooks
- **API**: Mistral AI Chat Completions

## License

This project is for educational and demonstration purposes.
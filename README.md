# Simulador de Crédito Hipotecario

A mortgage loan simulator built with React and Vite that helps users calculate monthly payments, amortization schedules, and total costs including insurance.

## Features

- Calculate monthly mortgage payments
- View amortization schedule
- Include extra payments
- Calculate life and property insurance
- Export results to PDF
- Responsive design
- Colombian Peso formatting

## Technologies Used

- React 19
- Vite 7
- Tailwind CSS 3
- jsPDF
- html2canvas
- PostCSS
- ESLint

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/simulador-credito.git
cd simulador-credito
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
simulador-credito/
├── src/
│   ├── components/
│   │   └── SimuladorCredito.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
└── tailwind.config.js
```

## Configuration Files

- `vite.config.js` - Vite configuration
- `postcss.config.js` - PostCSS configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.js` - ESLint configuration

## Accessibility

This project follows WCAG 2.1 guidelines and includes:
- ARIA labels and roles
- Keyboard navigation support
- High contrast color scheme
- Screen reader compatibility
- Form input validation
- Semantic HTML structure

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

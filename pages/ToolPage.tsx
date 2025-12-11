import React from 'react';
import { Tool } from '../types';
import { navigate } from '../utils/navigation';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import ToolPlaceholder from '../components/ToolPlaceholder';

// Image Tools
import ImageCompressor from '../components/ImageCompressor';
import ImageResizer from '../components/ImageResizer';
import ImageConverter from '../components/ImageConverter';
import PhotoEditor from '../components/PhotoEditor';
import BackgroundRemover from '../components/BackgroundRemover';
import WatermarkImage from '../components/WatermarkImage';
import ImageToPdf from '../components/ImageToPdf';

// PDF Tools
import MergePdf from '../components/MergePdf';
import SplitPdf from '../components/SplitPdf';
import CompressPdf from '../components/CompressPdf';
import ProtectPdf from '../components/ProtectPdf';
import PdfToWord from '../components/PdfToWord';
import PdfToExcel from '../components/PdfToExcel';
import PdfToPpt from '../components/PdfToPpt';

// Audio Tools
import AudioConverter from '../components/AudioConverter';
import TrimAudio from '../components/TrimAudio';
import MergeAudio from '../components/MergeAudio';
import AudioExtractor from '../components/AudioExtractor';

// Video Tools
import VideoCompressor from '../components/VideoCompressor';
import VideoConverter from '../components/VideoConverter';
import TrimVideo from '../components/TrimVideo';
import AddSubtitles from '../components/AddSubtitles';

// Calculator Tools
import AgeCalculator from '../components/AgeCalculator';
import PercentageCalculator from '../components/PercentageCalculator';
import BMICalculator from '../components/BMICalculator';
import GPACalculator from '../components/GPACalculator';

// Finance Tools
import LoanCalculator from '../components/LoanCalculator';
import InvestmentCalculator from '../components/InvestmentCalculator';
import BudgetPlanner from '../components/BudgetPlanner';
import CurrencyConverter from '../components/CurrencyConverter';
import TipCalculator from '../components/TipCalculator';

// Productivity Tools
import PomodoroTimer from '../components/PomodoroTimer';
import ToDoListMaker from '../components/ToDoListMaker';
import MarkdownEditor from '../components/MarkdownEditor';
import TimeZoneConverter from '../components/TimeZoneConverter';

// Education Tools
import FlashcardMaker from '../components/FlashcardMaker';
import CitationGenerator from '../components/CitationGenerator';
import ReadabilityScore from '../components/ReadabilityScore';

// Utility Tools
import RandomNamePicker from '../components/RandomNamePicker';
import PasswordGenerator from '../components/PasswordGenerator';
import QRCodeGenerator from '../components/QRCodeGenerator';
import LoremIpsumGenerator from '../components/LoremIpsumGenerator';
import CaseConverter from '../components/CaseConverter';
import TimestampConverter from '../components/TimestampConverter';

// Developer Tools
import JSONFormatter from '../components/JSONFormatter';
import Base64EncodeDecode from '../components/Base64EncodeDecode';
import URLEncoderDecoder from '../components/URLEncoderDecoder';

// Content Creator Tools
import TextSummarizer from '../components/TextSummarizer';
import ContentOriginalityChecker from '../components/ContentOriginalityChecker';
import HeadlineAnalyzer from '../components/HeadlineAnalyzer';

// SEO Tools
import SERPPreviewTool from '../components/SERPPreviewTool';
import UTMLinkBuilder from '../components/UTMLinkBuilder';
import KeywordDensityChecker from '../components/KeywordDensityChecker';

const componentMap: { [key: string]: React.ComponentType<{ toolName?: string }> } = {
  // Image
  'Image Compressor': ImageCompressor,
  'Image Resizer': ImageResizer,
  'Image Converter': ImageConverter,
  'Photo Editor': PhotoEditor,
  'Background Remover': BackgroundRemover,
  'Watermark Image': WatermarkImage,
  'Image to PDF': ImageToPdf,
  // PDF
  'Merge PDF': MergePdf,
  'Split PDF': SplitPdf,
  'Compress PDF': CompressPdf,
  'Protect PDF': ProtectPdf,
  'PDF to Word': PdfToWord,
  'PDF to Excel': PdfToExcel,
  'PDF to PowerPoint': PdfToPpt,
  // Audio
  'Audio Converter': AudioConverter,
  'Trim Audio': TrimAudio,
  'Merge Audio': MergeAudio,
  'Extract Audio from Video': AudioExtractor,
  // Video
  'Video Compressor': VideoCompressor,
  'Video Converter': VideoConverter,
  'Trim Video': TrimVideo,
  'Add Subtitles to Video': AddSubtitles,
  // Calculator
  'Age Calculator': AgeCalculator,
  'Percentage Calculator': PercentageCalculator,
  'BMI Calculator': BMICalculator,
  'GPA Calculator': GPACalculator,
  // Finance
  'Loan Calculator': LoanCalculator,
  'Investment Calculator': InvestmentCalculator,
  'Budget Planner': BudgetPlanner,
  'Currency Converter': CurrencyConverter,
  'Tip Calculator': TipCalculator,
  // Productivity
  'Pomodoro Timer': PomodoroTimer,
  'To-Do List Maker': ToDoListMaker,
  'Markdown Editor': MarkdownEditor,
  'Time Zone Converter': TimeZoneConverter,
  // Education
  'Flashcard Maker': FlashcardMaker,
  'Citation Generator': CitationGenerator,
  'Readability Score Checker': ReadabilityScore,
  // Utility
  'Random Name Picker': RandomNamePicker,
  'Password Generator': PasswordGenerator,
  'QR Code Generator': QRCodeGenerator,
  'Lorem Ipsum Generator': LoremIpsumGenerator,
  'Case Converter': CaseConverter,
  'Unix Timestamp Converter': TimestampConverter,
  // Developer
  'JSON Formatter': JSONFormatter,
  'Base64 Encode/Decode': Base64EncodeDecode,
  'URL Encoder/Decoder': URLEncoderDecoder,
  // Content
  'Text Summarizer': TextSummarizer,
  'Content Originality Checker': ContentOriginalityChecker,
  'Headline Analyzer': HeadlineAnalyzer,
  // SEO
  'SERP Preview Tool': SERPPreviewTool,
  'UTM Link Builder': UTMLinkBuilder,
  'Keyword Density Checker': KeywordDensityChecker,
};

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: React.FC<ToolPageProps> = ({ tool }) => {
  const ToolComponent = componentMap[tool.name] || ToolPlaceholder;

  return (
    <>
      <div className="mb-8">
        <a 
          href="#/" 
          onClick={(e) => { e.preventDefault(); navigate('/'); }} 
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to All Tools
        </a>
      </div>

      <header className="text-center mb-10">
        <div className="inline-block p-4 bg-brand-accent/20 text-brand-primary dark:text-brand-accent rounded-full mb-4">
          <tool.icon className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{tool.name}</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">{tool.description}</p>
      </header>

      <section className="max-w-7xl mx-auto">
        <ToolComponent toolName={tool.name} />
      </section>
    </>
  );
};

export default ToolPage;

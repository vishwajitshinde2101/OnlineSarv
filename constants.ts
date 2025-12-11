import { Tool, ToolCategoryName } from './types';

// Icons
import AudioIcon from './components/icons/AudioIcon';
import CalculatorIcon from './components/icons/CalculatorIcon';
import CodeIcon from './components/icons/CodeIcon';
import CropIcon from './components/icons/CropIcon';
import EducationIcon from './components/icons/EducationIcon';
import FeatherIcon from './components/icons/FeatherIcon';
import FinanceIcon from './components/icons/FinanceIcon';
import ImageIcon from './components/icons/ImageIcon';
import LockIcon from './components/icons/LockIcon';
import PdfIcon from './components/icons/PdfIcon';
import ProductivityIcon from './components/icons/ProductivityIcon';
import SeoIcon from './components/icons/SeoIcon';
import SlidersIcon from './components/icons/SlidersIcon';
import UtilityIcon from './components/icons/UtilityIcon';
import VideoIcon from './components/icons/VideoIcon';


export const TOOLS: Tool[] = [
    // Image Tools
    { name: 'Image Compressor', description: 'Reduce the file size of your images without losing quality.', category: ToolCategoryName.IMAGE, icon: ImageIcon },
    { name: 'Image Resizer', description: 'Resize images to your desired dimensions by pixel or percentage.', category: ToolCategoryName.IMAGE, icon: CropIcon },
    { name: 'Image Converter', description: 'Convert images between formats like JPG, PNG, and WEBP.', category: ToolCategoryName.IMAGE, icon: ImageIcon },
    { name: 'Photo Editor', description: 'A simple yet powerful editor to crop, filter, and adjust your photos.', category: ToolCategoryName.IMAGE, icon: SlidersIcon },
    { name: 'Background Remover', description: 'Automatically remove the background from any image.', category: ToolCategoryName.IMAGE, icon: ImageIcon },
    { name: 'Watermark Image', description: 'Add a text or image watermark to your pictures.', category: ToolCategoryName.IMAGE, icon: ImageIcon },
    { name: 'Image to PDF', description: 'Convert JPG, PNG, and other images into a single PDF file.', category: ToolCategoryName.IMAGE, icon: PdfIcon },

    // PDF Tools
    { name: 'Merge PDF', description: 'Combine multiple PDF files into a single document.', category: ToolCategoryName.PDF, icon: PdfIcon },
    { name: 'Split PDF', description: 'Extract one or more pages from a PDF file.', category: ToolCategoryName.PDF, icon: PdfIcon },
    { name: 'Compress PDF', description: 'Reduce the file size of your PDF documents.', category: ToolCategoryName.PDF, icon: PdfIcon },
    { name: 'Protect PDF', description: 'Add a password to your PDF to encrypt and protect it.', category: ToolCategoryName.PDF, icon: LockIcon },
    { name: 'PDF to Word', description: 'Convert PDF files into editable Word (.docx) documents.', category: ToolCategoryName.PDF, icon: PdfIcon },
    { name: 'PDF to Excel', description: 'Extract tables from PDF files into Excel spreadsheets.', category: ToolCategoryName.PDF, icon: PdfIcon },
    { name: 'PDF to PowerPoint', description: 'Convert PDF pages into PowerPoint presentations.', category: ToolCategoryName.PDF, icon: PdfIcon },

    // Audio Tools
    { name: 'Audio Converter', description: 'Convert audio files between different formats like MP3, WAV, etc.', category: ToolCategoryName.AUDIO, icon: AudioIcon },
    { name: 'Trim Audio', description: 'Cut or trim audio files to your desired length.', category: ToolCategoryName.AUDIO, icon: AudioIcon },
    { name: 'Merge Audio', description: 'Combine multiple audio files into a single track.', category: ToolCategoryName.AUDIO, icon: AudioIcon },
    { name: 'Extract Audio from Video', description: 'Extract the sound or music from a video file.', category: ToolCategoryName.AUDIO, icon: AudioIcon },

    // Video Tools
    { name: 'Video Compressor', description: 'Reduce the file size of your video files.', category: ToolCategoryName.VIDEO, icon: VideoIcon },
    { name: 'Video Converter', description: 'Convert videos between formats like MP4, WEBM, MOV, etc.', category: ToolCategoryName.VIDEO, icon: VideoIcon },
    { name: 'Trim Video', description: 'Cut or trim your video clips to the perfect length.', category: ToolCategoryName.VIDEO, icon: VideoIcon },
    { name: 'Add Subtitles to Video', description: 'Easily add SRT or VTT subtitle files to your videos.', category: ToolCategoryName.VIDEO, icon: VideoIcon },

    // Calculator Tools
    { name: 'Age Calculator', description: 'Calculate your age in years, months, days, and more.', category: ToolCategoryName.CALCULATOR, icon: CalculatorIcon },
    { name: 'Percentage Calculator', description: 'Quickly calculate percentages for various scenarios.', category: ToolCategoryName.CALCULATOR, icon: CalculatorIcon },
    { name: 'BMI Calculator', description: 'Calculate your Body Mass Index (BMI).', category: ToolCategoryName.CALCULATOR, icon: CalculatorIcon },
    { name: 'GPA Calculator', description: 'Calculate your Grade Point Average (GPA).', category: ToolCategoryName.CALCULATOR, icon: CalculatorIcon },

    // Finance Tools
    { name: 'Loan Calculator', description: 'Calculate monthly payments and total interest for a loan.', category: ToolCategoryName.FINANCE, icon: FinanceIcon },
    { name: 'Investment Calculator', description: 'Project the growth of your investments with compound interest.', category: ToolCategoryName.FINANCE, icon: FinanceIcon },
    { name: 'Budget Planner', description: 'Track your income and expenses to manage your finances.', category: ToolCategoryName.FINANCE, icon: FinanceIcon },
    { name: 'Currency Converter', description: 'Convert between different currencies with live rates.', category: ToolCategoryName.FINANCE, icon: FinanceIcon },
    { name: 'Tip Calculator', description: 'Calculate the tip and split the bill between friends.', category: ToolCategoryName.FINANCE, icon: FinanceIcon },

    // Productivity Tools
    { name: 'Pomodoro Timer', description: 'A customizable timer to help you focus using the Pomodoro Technique.', category: ToolCategoryName.PRODUCTIVITY, icon: ProductivityIcon },
    { name: 'To-Do List Maker', description: 'A simple and effective to-do list to organize your tasks.', category: ToolCategoryName.PRODUCTIVITY, icon: ProductivityIcon },
    { name: 'Markdown Editor', description: 'A live Markdown editor with a side-by-side preview.', category: ToolCategoryName.PRODUCTIVITY, icon: CodeIcon },
    { name: 'Time Zone Converter', description: 'Convert times between different time zones around the world.', category: ToolCategoryName.PRODUCTIVITY, icon: ProductivityIcon },

    // Education Tools
    { name: 'Flashcard Maker', description: 'Create and study with your own digital flashcards.', category: ToolCategoryName.EDUCATION, icon: EducationIcon },
    { name: 'Citation Generator', description: 'Generate citations in APA, MLA, and Chicago formats.', category: ToolCategoryName.EDUCATION, icon: EducationIcon },
    { name: 'Readability Score Checker', description: 'Analyze the readability and grade level of your text.', category: ToolCategoryName.EDUCATION, icon: EducationIcon },

    // Other Useful Tools
    { name: 'Random Name Picker', description: 'Randomly pick a name from a list.', category: ToolCategoryName.UTILITY, icon: UtilityIcon },
    { name: 'Password Generator', description: 'Create strong, secure, and random passwords.', category: ToolCategoryName.UTILITY, icon: LockIcon },
    { name: 'QR Code Generator', description: 'Generate QR codes for URLs, text, and more.', category: ToolCategoryName.UTILITY, icon: UtilityIcon },
    { name: 'Lorem Ipsum Generator', description: 'Generate placeholder text in various lengths and formats.', category: ToolCategoryName.UTILITY, icon: FeatherIcon },
    { name: 'Case Converter', description: 'Convert text to different cases like UPPERCASE, lowercase, etc.', category: ToolCategoryName.UTILITY, icon: UtilityIcon },
    { name: 'Unix Timestamp Converter', description: 'Convert between Unix timestamps and human-readable dates.', category: ToolCategoryName.UTILITY, icon: UtilityIcon },

    // Software Developer Tools
    { name: 'JSON Formatter', description: 'Format, validate, and beautify your JSON data.', category: ToolCategoryName.DEVELOPER, icon: CodeIcon },
    { name: 'Base64 Encode/Decode', description: 'Encode and decode strings using Base64.', category: ToolCategoryName.DEVELOPER, icon: CodeIcon },
    { name: 'URL Encoder/Decoder', description: 'Encode or decode strings for use in URLs.', category: ToolCategoryName.DEVELOPER, icon: CodeIcon },

    // Content Creator Tools
    { name: 'Text Summarizer', description: 'Summarize long articles or text into key points using AI.', category: ToolCategoryName.CONTENT, icon: FeatherIcon },
    { name: 'Content Originality Checker', description: 'Get an AI-based originality score for your content.', category: ToolCategoryName.CONTENT, icon: FeatherIcon },
    { name: 'Headline Analyzer', description: 'Analyze your headline and get suggestions for improvement.', category: ToolCategoryName.CONTENT, icon: FeatherIcon },

    // SEO Tools
    { name: 'SERP Preview Tool', description: 'Preview how your webpage will look on a Google search results page.', category: ToolCategoryName.SEO, icon: SeoIcon },
    { name: 'UTM Link Builder', description: 'Build UTM-tagged URLs for your marketing campaigns.', category: ToolCategoryName.SEO, icon: SeoIcon },
    { name: 'Keyword Density Checker', description: 'Check the density of keywords in your text.', category: ToolCategoryName.SEO, icon: SeoIcon },
];

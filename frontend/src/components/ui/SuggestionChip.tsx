import { Sparkles, ChevronRight } from './Icons';

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
  icon?: 'sparkles' | 'arrow';
}

export function SuggestionChip({ text, onClick, icon = 'sparkles' }: SuggestionChipProps) {
  const Icon = icon === 'sparkles' ? Sparkles : ChevronRight;

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/50
                 hover:bg-gray-200 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700/50
                 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-200
                 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      <Icon className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
      <span>{text}</span>
    </button>
  );
}

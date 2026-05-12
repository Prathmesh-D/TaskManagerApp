import { formatDate } from '../../utils/helpers';
import ThemeToggle from './ThemeToggle';
import SearchBar from '../filters/SearchBar';

export default function Header({ theme, onToggleTheme, searchValue, onSearch }) {
  const today = formatDate(new Date());

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-mono font-bold text-ink tracking-tighter">Tasks</h1>
          <p className="text-sm text-ink-tertiary mt-0.5">{today}</p>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <SearchBar value={searchValue} onChange={onSearch} />
    </header>
  );
}

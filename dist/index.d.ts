import * as react_jsx_runtime from 'react/jsx-runtime';

interface ScoreEntry {
    score: number;
    label: string;
}

interface PughMatrixProps {
    criteria: string[];
    tools: string[];
    scores: Record<string, Record<string, ScoreEntry>>;
    highlight?: string;
    isDark?: boolean;
}
declare function PughMatrix({ criteria, tools, scores, highlight, isDark, }: PughMatrixProps): react_jsx_runtime.JSX.Element;

export { PughMatrix, type PughMatrixProps, type ScoreEntry };

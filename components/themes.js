import { useTheme } from 'next-themes';
import { useState, useRef, useEffect } from 'react';
import styles from './themes.module.css';

export const themeList = [
    'latte', 'frappe', 'macchiato', 'mocha'
];
export const themeListHumanReadable = [
    'Catppuccin Latte',
    'Catppuccin Frappe',
    'Catppuccin Macchiato',
    'Catppuccin Mocha',
];
export default function ThemeButton() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const ref = useRef(null);

    useEffect(() => {
        setMounted(true)
    }, []);

    if(!mounted) return null

    function switchThemes() {
        var newIndex = themeList.indexOf(theme)+1;
        if(newIndex==themeList.length) newIndex=0;
        setTheme(themeList[newIndex]);
        ref.current.innerText=themeListHumanReadable[newIndex];
    }
    return (
        <button className={styles.themeButton} onClick={()=>{switchThemes()}}>
            <span ref={ref}>{themeListHumanReadable[themeList.indexOf(theme)]}</span>
        </button>
    )
}

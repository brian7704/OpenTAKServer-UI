import { Switch, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

export default function DarkModeSwitch() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return <Switch size="md" onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')} />;
}

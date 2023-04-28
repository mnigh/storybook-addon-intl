import { useGlobals } from '@storybook/preview-api';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { GLOBALS_KEY, PARAMETER_KEY } from '../../constants';
import { validateConfig } from '../../utils/validateConfig';
import { getActiveLocale } from '../../utils/getActiveLocale';

export function withIntl(StoryFn, context) {
    const { parameters } = context;
    const intlConfig = parameters[PARAMETER_KEY];
    const error = validateConfig(intlConfig);

    const [globals] = useGlobals();
    const intlGlobals = globals[GLOBALS_KEY];

    const locales = intlConfig?.locales ?? [];

    const activeLocale = getActiveLocale(
        locales,
        intlGlobals?.activeLocale,
        intlConfig?.defaultLocale
    );

    if (!!error || !activeLocale) {
        return null;
    }

    const { getMessages, getFormats } = intlConfig;

    const messages = getMessages(activeLocale);
    const formats =
        typeof getFormats === 'function' ? getFormats(activeLocale) : undefined;

    return (
        <IntlProvider
            locale={activeLocale}
            messages={messages}
            formats={formats}
        >
            {StoryFn()}
        </IntlProvider>
    );
}

import ReactFlagsSelect from "react-flags-select";
import axios from "@/axios_config.tsx";
import {apiRoutes} from "@/apiRoutes.tsx";
import {notifications} from "@mantine/notifications";
import {IconLanguageHiragana, IconX, IconCheck} from "@tabler/icons-react";
import React, {useState, useEffect, useReducer} from "react";
import { useTranslation } from 'react-i18next';

interface LanguageInfo {
    name: string;
    language_code: string;
}

export default function LanguageSelector(): React.ReactElement {
    const [languages, setLanguages] = useState<Map<string, LanguageInfo>>();
    const [countries, setCountries] = useState<string[]>([]);
    const [labels, setLabels] = useState({});
    const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem("country") === undefined ? "US" : localStorage.getItem("country")!);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        get_languages();
    }, [])

    useEffect(() => {
        set_language(selectedCountry);
    }, [selectedCountry]);

    function set_language(selectedCountry: string) {
        if (languages === undefined || selectedCountry === undefined || languages.get(selectedCountry) === undefined) {
            return;
        }

        let language = languages.get(selectedCountry);

        axios.put(apiRoutes.language + "/" + language?.language_code)
            .then(r => {
                    if (r.status === 200) {
                        if (language !== undefined) {
                            i18n.changeLanguage(language?.language_code).then((translation) => {});
                            localStorage.setItem("country", selectedCountry);

                            notifications.show({
                                title: t("Success"),
                                message: t(`Language changed to ${language.name}`),
                                color: 'green',
                                icon: <IconCheck />,
                            })
                        }
                    }
                }
            ).catch(err => {
            console.log(err);
            notifications.show({
                title: t('Failed to set language'),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />,
            })
        })
    }

    function get_languages() {
        axios.get(apiRoutes.language).then((r) => {
            if (r.status === 200) {
                let supported_languages = new Map();
                setCountries(Object.keys(r.data));

                let custom_labels:any = {}

                for (const countryCode in r.data) {
                    let language: LanguageInfo = r.data[countryCode];
                    custom_labels[countryCode] = language.name;
                    supported_languages.set(countryCode, language);
                }

                setLanguages(supported_languages);
                setLabels(custom_labels)
            }
        }).catch((err) => {
            console.log(err);
            notifications.show({
                title: t('Failed to get supported languages'),
                message: err.response.data.error,
                color: 'red',
                icon: <IconX />,
            });
        })
    }

    return (
        <>
            <ReactFlagsSelect
                selected={selectedCountry}
                onSelect={(country) => {setSelectedCountry(country)}}
                customLabels={labels}
                countries={countries}
                fullWidth={false}
                className="language-selector"
                placeholder={<IconLanguageHiragana />}
            />
        </>
    )
}

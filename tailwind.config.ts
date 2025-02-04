import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: ["./src/**/*.{vue,html,js,ts,md}"],
    theme: {
        extend: {
            colors: {
                primary: "#ffbb00",
                secondary: "#c940af"
            },
            fontFamily: {
                "cabin": ['Cabin'],
                "jetbrains": ['"JetBrains Mono"'],
            },
            typography: ( theme: any ) => ({
                DEFAULT: {
                    css: {
                        fontFamily: theme("cabin"),
                        color: theme("colors.neutral.200"),
                        fontSize: theme("fontSize.base"),
                        maxWidth: "none",

                        "p": {
                            marginTop: theme("spacing.2"),
                            marginBottom: theme("spacing.2"),
                        },

                        "h1": {
                            color: theme("colors.primary"),
                            margin: 0,
                            background: `repeating-linear-gradient(
                -45deg,
                #262626,
                #262626 10px,
                #171717 10px,
                #171717 20px
                ) top left scroll`,
                            paddingBottom: theme("spacing.1"),
                            paddingTop: theme("spacing.1"),
                            paddingLeft: theme("spacing.2"),
                        },

                        "h2": {
                            color: theme("colors.white"),
                            background: `repeating-linear-gradient(
                -45deg,
                #5C2951,
                #5C2951 10px,
                #3e1736 10px,
                #3e1736 20px
                ) top left scroll`,
                            borderBottom: `2px solid ${theme("colors.secondary")}`,
                            paddingLeft: theme("spacing.2"),
                            marginTop: theme("spacing.4"),
                            marginBottom: 0,
                            marginLeft: 0,
                            marginRight: 0,
                        },

                        "h3": {
                            color: theme("colors.white"),
                            textDecorationLine: "underline",
                            margin: 0
                        },

                        "strong": {
                            color: theme("colors.white")
                        },

                        "ol > li::marker": {
                            color: theme("colors.secondary"),
                        },

                        "ul > li::marker": {
                            color: theme("colors.secondary"),
                        },

                        "a": {
                            color: theme("colors.primary"),
                        },

                        "code": {
                            borderRadius: theme("borderRadius.sm"),
                            backgroundColor: theme("colors.neutral.800"),
                            color: theme("colors.neutral.400"),
                            outline: `1px solid ${theme("colors.neutral.700")}`,
                            padding: "0.125rem",
                            // paddingLeft: theme("spacing.0.5"),
                            // paddingRight: theme("spacing.0.5"),
                            // paddingTop: theme("spacing.0.5"),
                            // paddingBottom: theme("spacing.0.5"),
                            marginLeft: theme("margin.1"),
                            marginRight: theme("margin.1"),
                            fontFamily: theme("fontFamily.jetbrains"),
                        },

                        "code::before": {
                            content: ""
                        },

                        "code::after": {
                            content: ""
                        },

                        "code:hover": {
                            color: theme("colors.secondary"),
                            outline: `1px solid ${theme("colors.neutral.500")}`,
                        },

                        "pre": {
                            backgroundColor: "transparent",
                        },

                        "pre code": {
                            borderRadius: "0.375rem",
                            fontFamily: theme("fontFamily.jetbrains"),
                            fontSize: theme("fontSize.xs"),
                        },

                        "table": {
                            backgroundColor: theme("colors.neutral.900"),
                            color: theme("colors.neutral.200"),
                            borderCollapse: "separate",
                            borderSpacing: 0,
                            border: `1px solid ${theme("colors.neutral.700")}`,
                            borderRadius: theme("borderRadius.md"),
                            padding: theme("padding.1"),
                        },

                        "table th": {
                            borderBottom: `1px solid ${theme("colors.neutral.700")}`,
                            borderCollapse: "separate",
                        },

                        "table tbody td": {
                            padding: `0 ${theme("padding.2")} 0 ${theme("padding.2")}`,
                        },

                        "table tbody tr:nth-child(odd)": {
                            backgroundColor: theme("colors.neutral.800"),
                        },

                        "table thead th": {
                            color: theme("colors.primary"),
                            fontWeight: '600',
                            padding: `0 ${theme("padding.2")} 0 ${theme("padding.2")}`,
                            fontFamily: theme("fontFamily.jetbrains"),
                        },

                        "img": {
                            marginTop: theme("spacing.2"),
                            marginBottom: theme("spacing.2"),
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: theme("borderRadius.md"),
                            outline: `2px solid ${theme("colors.neutral.700")}`,
                            //width: "fit-content",
                            //height: "auto",
                            //maxHeight: "50vh",
                            //maxWidth: "fit-content"
                            maxHeight: theme("spacing.80"),
                        },

                        "img:hover": {
                            outline: `2px solid ${theme("colors.neutral.500")}`,
                        },
                    }
                }
            })
        },
    },
    plugins: [
        require('tailwindcss-unimportant'),
        require('@tailwindcss/typography'),
    ],
}
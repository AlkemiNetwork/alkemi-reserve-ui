module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ["plugin:vue/essential", "@vue/prettier"],
	rules: {
		"no-console": "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"vue/no-unused-components": "off"
	},
	parserOptions: {
		parser: "babel-eslint"
	},
	overrides: [{
		files: ["**/__tests__/*.{j,t}s?(x)"],
		env: {
			mocha: true
		}
	}]
};
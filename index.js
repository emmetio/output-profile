'use strict';

import defaultOptions from './defaults';

/**
 * Creates output profile for given options (@see defaults)
 * @param {defaults} options
 */
export default class Profile {
    constructor(options) {
        this.options = Object.assign({}, defaultOptions, options);
        this.quoteChar = this.options.attributeQuotes === 'single' ? '\'' : '"';
    }

    /**
     * Quote given string according to profile
     * @param {String} str String to quote
     * @return {String}
     */
    quote(str) {
        return `${this.quoteChar}${str != null ? str : ''}${this.quoteChar}`;
    }

    /**
     * Output given tag name accoding to options
     * @param {String} name
     * @return {String}
     */
    name(name) {
        return strcase(name, this.options.tagCase);
    }

	/**
	 * Outputs either full attribute or attribute name accoding to current settings
	 * @param {Attribute|String} Attribute node or attribute name
	 * @return {String}
	 */
    attribute(attr) {
		if (typeof attr === 'string') {
			return strcase(attr, this.options.attributeCase);
		}

		if (attr.options.implied && attr.value == null) {
			return '';
		}

		const attrName = this.attribute(attr.name);

        if (this.isBooleanAttribute(attr)) {
			return this.options.compactBooleanAttributes
				? attrName
				: `${attrName}=${this.quote(attrName)}`
		}

		return `${attrName}=${this.quote(attr.value)}`;
    }

    /**
     * Check if given attribute is boolean
     * @param {Attribute} attr
     * @return {Boolean}
     */
    isBooleanAttribute(attr) {
        return attr.options.boolean
			|| this.options.booleanAttributes.has(attr.name.toLowerCase());
    }

	/**
	 * Returns a token for self-closing tag, depending on current options
	 * @return {String}
	 */
	selfClose() {
		switch (this.options.selfClosingStyle) {
			case 'xhtml': return ' /';
			case 'xml':   return '/';
			default:      return '';
		}
	}

	/**
	 * Returns indent for given level
	 * @param {Number} level Indentation level
	 * @return {String}
	 */
	indent(level) {
		level = level || 0;
		let output = '';
		while (level--) {
			output += this.options.indent;
		}

		return output;
	}

	/**
	 * Check if given tag name belongs to inline-level element
	 * @param {Node|String} name Parsed node or tag name
	 * @return {Boolean}
	 */
	isInline(name) {
        if (typeof name === 'string') {
            return this.options.inlineElements.has(name.toLowerCase());
        }

        // inline node is a node either with inline-level name or text-only node
        return node.name != null ? this.isInline(node.name) : node.isTextOnly;
	}
};

function strcase(string, type) {
    if (type) {
        string = type === 'upper' ? string.toUpperCase() : string.toLowerCase();
    }
    return string;
}

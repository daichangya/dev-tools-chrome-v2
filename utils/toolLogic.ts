

// Helper logic for synchronous tools

export const formatJson = (input: string): string => {
  if (!input.trim()) return '';

  const parse = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  // 1. Try standard parse
  let result = parse(input);

  // 2. Try unescaping (handling \" -> ")
  // This supports the requested format: {\"api_version\":\"1.0.0\",...}
  if (result === null) {
    const unescaped = input.replace(/\\"/g, '"');
    result = parse(unescaped);
  }

  // 3. Handle double encoded strings
  // If the result is a string, and that string looks like JSON, parse it again.
  // Example: "{\"a\":1}" -> parses to string '{"a":1}' -> parses to object {a:1}
  if (typeof result === 'string') {
    const doubleParsed = parse(result);
    if (doubleParsed !== null) {
      result = doubleParsed;
    }
  }

  if (result === null) {
    return "Invalid JSON";
  }

  return JSON.stringify(result, null, 2);
};

export const compressJson = (input: string): string => {
  if (!input.trim()) return '';
  try {
    const obj = JSON.parse(input);
    return JSON.stringify(obj);
  } catch (e) {
    return input; // Return original if invalid
  }
};

export const highlightJson = (json: string): string => {
  if (!json) return '';
  
  // Basic Regex tokenizer for JSON highlighting
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'number';
      // Escape HTML entities to prevent injection
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
          // Remove the colon from the match for the span, append it after
          return `<span class="${cls}">${esc(match.slice(0, -1))}</span>:`;
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${esc(match)}</span>`;
    }
  );
};

export const formatXml = (xml: string): string => {
  let formatted = '';
  let indent = '';
  const tab = '  ';
  xml.split(/>\s*</).forEach(function(node) {
      if (node.match( /^\/\w/ )) indent = indent.substring(tab.length);
      formatted += indent + '<' + node + '>\r\n';
      if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;
  });
  return formatted.substring(1, formatted.length-3);
};

export const highlightXml = (xml: string): string => {
  if (!xml) return '';
  return xml.replace(/(&lt;|<)(.+?)(&gt;|>)/g, function(match, lt, content, gt) {
     let inner = content;
     // Highlight tag name
     inner = inner.replace(/^(\/?[\w:-]+)/, '<span class="tag">$1</span>');
     // Highlight attributes
     inner = inner.replace(/(\s+)([\w:-]+)(=)/g, '$1<span class="attr-name">$2</span>$3');
     // Highlight attribute values
     inner = inner.replace(/(".*?")/g, '<span class="attr-value">$1</span>');
     
     return `${lt}${inner}${gt}`;
  });
};

export const toBase64 = (input: string): string => {
  try {
    return btoa(input);
  } catch (e) {
    return "Error converting to Base64";
  }
};

export const fromBase64 = (input: string): string => {
  try {
    return atob(input);
  } catch (e) {
    return "Invalid Base64 string";
  }
};

// Simple pseudo-encryption (Caesar/Shift for demo purposes as native crypto is complex for single file)
// In a real app, use SubtleCrypto or crypto-js
export const simpleEncrypt = (text: string, key: number = 3): string => {
  return text.split('').map(c => String.fromCharCode(c.charCodeAt(0) + key)).join('');
};

export const simpleDecrypt = (text: string, key: number = 3): string => {
  return text.split('').map(c => String.fromCharCode(c.charCodeAt(0) - key)).join('');
};

export const toAsciiBinary = (text: string): string => {
  return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
};

export const toUnicode = (text: string): string => {
  return text.split('').map(char => {
    const hex = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    return `\\u${hex}`;
  }).join('');
};

export const reverseString = (text: string): string => {
  return text.split('').reverse().join('');
};

export const convertCase = (text: string, type: 'upper' | 'lower' | 'capital'): string => {
  if (type === 'upper') return text.toUpperCase();
  if (type === 'lower') return text.toLowerCase();
  if (type === 'capital') return text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  return text;
};

// --- JSON to JavaBean Logic ---

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const jsonToJavaBean = (jsonStr: string, rootName: string = "Root"): string => {
  try {
    let obj;
    try {
      obj = JSON.parse(jsonStr);
    } catch (e) {
      // Try to recover escaped JSON here too for consistency
      try {
         obj = JSON.parse(jsonStr.replace(/\\"/g, '"'));
      } catch(e2) {
         return "Invalid JSON Data";
      }
    }

    if (Array.isArray(obj)) {
      return "// The root of the JSON input is an array. Please provide a JSON object.";
    }

    // Helper to determine Java type and potentially generate nested class
    function getType(value: any, key: string): { type: string, nestedClass?: string } {
      if (value === null) return { type: 'Object' };
      if (typeof value === 'string') return { type: 'String' };
      if (typeof value === 'number') return { type: Number.isInteger(value) ? 'int' : 'double' };
      if (typeof value === 'boolean') return { type: 'boolean' };

      if (Array.isArray(value)) {
        if (value.length === 0) return { type: 'List<Object>' };
        const first = value[0];
        
        // Handle list of objects
        if (typeof first === 'object' && first !== null) {
          const singularName = capitalize(key).replace(/s$/, '') || "Item";
          const nested = generateClassStr(singularName, first);
          return { type: `List<${singularName}>`, nestedClass: nested };
        }
        
        // Handle list of primitives
        const inner = getType(first, key);
        let innerType = inner.type;
        // Box primitives for Lists
        if (innerType === 'int') innerType = 'Integer';
        if (innerType === 'double') innerType = 'Double';
        if (innerType === 'boolean') innerType = 'Boolean';
        
        return { type: `List<${innerType}>` };
      }

      if (typeof value === 'object') {
        const className = capitalize(key);
        const nested = generateClassStr(className, value);
        return { type: className, nestedClass: nested };
      }

      return { type: 'Object' };
    }

    function generateClassStr(className: string, data: any): string {
      let fieldsStr = '';
      let methodsStr = '';
      let nestedClassesStr = '';

      Object.keys(data).forEach(key => {
        const val = data[key];
        const { type, nestedClass } = getType(val, key);

        if (nestedClass) {
          // Prevent duplicates if possible, but for simple POJO gen, appending is safer than complex dedup logic
          nestedClassesStr += nestedClass + '\n';
        }

        const fieldName = key;
        const methodSuffix = capitalize(key);

        fieldsStr += `    private ${type} ${fieldName};\n`;

        methodsStr += `    public void set${methodSuffix}(${type} ${fieldName}) {\n`;
        methodsStr += `        this.${fieldName} = ${fieldName};\n`;
        methodsStr += `    }\n`;
        methodsStr += `    public ${type} get${methodSuffix}() {\n`;
        methodsStr += `        return ${fieldName};\n`;
        methodsStr += `    }\n`;
      });

      return `
public static class ${className} {
${fieldsStr}
${methodsStr}
${nestedClassesStr}
}`;
    }

    const result = generateClassStr(rootName, obj);
    
    // Clean up the top level class to be non-static for standard usage
    const finalClass = result.replace(`public static class ${rootName}`, `public class ${rootName}`);

    return `package com.example;
import java.util.List;

${finalClass}`;

  } catch (e) {
    return "Parse Error: " + (e as Error).message;
  }
};

export const highlightJava = (code: string): string => {
  if (!code) return '';
  // Basic Regex tokenizer for Java
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Keywords
  html = html.replace(/\b(package|import|public|private|protected|class|static|void|return|new|int|double|boolean|String|List)\b/g, '<span class="keyword">$1</span>');
  
  // Annotations
  html = html.replace(/(@\w+)/g, '<span class="annotation">$1</span>');
  
  // Strings
  html = html.replace(/(".*?")/g, '<span class="string">$1</span>');

  // Comments (simple // support)
  html = html.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');

  return html;
};
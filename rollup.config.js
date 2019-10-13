import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss'
import json from 'rollup-plugin-json';
import { uglify } from 'rollup-plugin-uglify'
import image from 'rollup-plugin-image'

const NODE_ENV = process.env.NODE_ENV || 'development';
const outputFile = NODE_ENV === 'production' ? './dist/index.js' : './lib/index.js';

export default {
	input: 'src/index.js',
	output: {
		file: outputFile,
		format: 'cjs',
	},
	// All the used libs needs to be here
	external: [
		'react',
		'react-proptypes',
		'antd',
		'draft-js',
		'react-draft-wysiwyg',
		'react-is'
	],
	plugins: [
		postcss({
			plugins: []
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
		}),
		json(),
		resolve({
			jsnext: true,
			main: true
		}),
		babel({
			exclude: 'node_modules/**',
			externalHelpers: true
		}),
		commonjs({
			include: 'node_modules/**',
			namedExports: {
				'react-dom': ['unstable_batchedUpdates']
			},
		}),
		image(),
		// commonjs(
		// 	{
		// 		// non-CommonJS modules will be ignored, but you can also
		// 		// specifically include/exclude files
		// 		include: 'node_modules/!**',  // Default: undefined
		// 		exclude: [
		// 			'node_modules/draft-js/!**',
		// 		],
		//
		// 		// search for files other than .js files (must already
		// 		// be transpiled by a previous plugin!)
		// 		extensions: ['.js', '.coffee'],  // Default: [ '.js' ]
		//
		// 		// if true then uses of `global` won't be dealt with by this plugin
		// 		ignoreGlobal: true,  // Default: false
		//
		// 		// if false then skip sourceMap generation for CommonJS modules
		// 		sourceMap: true,  // Default: true
		//
		// 		// explicitly specify unresolvable named exports
		// 		// (see below for more details)
		// 		namedExports: {
		// 			'react-dom': [
		// 				'findDOMNode', 'createPortal', 'unstable_renderSubtreeIntoContainer'
		// 			],
		// 			'draft-js': [
		// 				'ContentState', 'EditorState', 'SelectionState',
		// 				'CompositeDecorator', 'convertToRaw', 'Modifier',
		// 				'KeyBindingUtil', 'DefaultDraftBlockRenderMap',
		// 				'getDefaultKeyBinding', 'Editor', 'genKey',
		// 				'CharacterMetadata', 'ContentBlock', 'convertFromHTML',
		// 				'BlockMapBuilder', 'DefaultDraftInlineStyle'
		// 			],
		// 			'draft-js/lib/DraftOffsetKey': ['decode'],
		// 			'immutable': ['Map', 'List', 'fromJS', 'OrderedSet', 'Repeat', 'is'],
		// 			'fbjs/lib/ExecutionEnvironment': ['canUseDOM'],
		// 			'react-is': [
		// 				'isElement', 'isValidElementType', 'ForwardRef'
		// 			]
		// 		},  // Default: undefined
		// 	}),
		uglify(),
	],
};

<template>
  <div class="vue-tiptap-katex">
    <div class="tiptap-container">
      <div v-if="editor"
           class="tiptap-header">
        <toolbar v-if="editorOptions"
                 ref="toolbar"
                 :editor="editor"
                 :options="editorOptions"
        />
      </div>
      <div v-if="editor" class="editor-content">
        <editor-content :editor="editor" />
      </div>
    </div>
  </div>
</template>

<script>
import toolbar from 'vue-tiptap-katex-core/components/toolbar/toolbar.vue'
import SlotBubbleMenu from 'vue-tiptap-katex-core/components/SlotBubbleMenu.vue'
import SlotFloatingMenu from 'vue-tiptap-katex-core/components/SlotFloatingMenu.vue'
import Link from '@tiptap/extension-link'
import Focus from '@tiptap/extension-focus'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import * as VueTiptapKatexAssist from 'vue-tiptap-katex-core/assist.js'

import {
  ExtensionTiptapShortkeys,
  ExtensionThinSpace,
  ExtensionTextDirection,
  ExtensionTableCell
} from 'vue-tiptap-katex-core'
import { DOMParser } from 'prosemirror-model'

import {
  Editor,
  EditorContent,
  BubbleMenu,
  FloatingMenu
} from '@tiptap/vue-3'
import mesra from 'vue3-tiptap-katex/src/components/poem/mesra.mjs'
import TiptapInteractiveReading from 'vue3-tiptap-katex/src/components/reading/extension.mjs'
import TiptapInteractivePoem from 'vue3-tiptap-katex/src/components/poem/bait.mjs'
import TiptapInteractiveImageUploadInline from 'vue3-tiptap-katex/src/components/ImageUpload/extensionImageInline.mjs'
import TiptapInteractiveVideoUploadInline from 'vue3-tiptap-katex/src/components/VideoUpload/extensionVideoInline.mjs'
import TiptapInteractiveAudioUploadInline from 'vue3-tiptap-katex/src/components/AudioUpload/extensionAudioUploadInline.mjs'
import TiptapInteractiveInsertScriptInline from 'vue3-tiptap-katex/src/components/InsertScript/extensionInsertScriptInline.mjs'
import TiptapInteractiveKatexInline from 'vue3-tiptap-katex/src/components/formula/extensionFormulaInline.mjs'
import EditTableModal from 'vue3-tiptap-katex/src/components/EditTableModal.vue'


export default {
  name: 'VueTiptapKatex',
  components: {
    EditTableModal,
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    toolbar,
    SlotBubbleMenu,
    SlotFloatingMenu
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    modelValue: {
      type: String,
      required: false,
      default: ''
    },
    editor: String
  },
  data() {
    return {
      editor: null,
      newModelValue: null,
      isPageMounted: false
    }
  },
  computed: {
    editorOptions() {
      const options = {
        bubbleMenu: true,
        floatingMenu: true,
        poem: false,
        reading: false,
        persianKeyboard: false,
        loadBareHtml: false,
        mathliveOptions: {},
        onResizeEnd: null
      }
      Object.assign(options, this.options)
      return options
    },
    localModelValue: {
      get () {
        return this.modelValue
      },
      set (newValue) {
        if (this.newModelValue === newValue) {
          return
        }
        this.$emit('update:modelValue', newValue)
      }
    }
  },
  beforeMount () {
    this.newModelValue = VueTiptapKatexAssist.convertToTiptap(this.localModelValue)
    this.localModelValue = VueTiptapKatexAssist.convertToTiptap(this.modelValue)
  },
  mounted () {
    const vueTiptapKatexInstance = this
    const editorConfig = {
      content: this.localModelValue,
      parseOptions: {
        preserveWhitespace: true
      },
      extensions: [
        Link.configure({ openOnClick: false }),
        Focus.configure({
          className: 'has-focus',
          mode: 'all'
        }),
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: { dir: 'auto' }
          }
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          defaultAlignment: ''
        }),
        Color.configure({
          types: ['textStyle']
        }),
        TextStyle,
        Document,
        Text,
        ExtensionTextDirection,
        Highlight.configure({
          multicolor: true
        }),
        Underline,
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: 'tiptap-table',
            style: 'border-collapse: collapse !important'
          }
        }),
        TableRow.extend({
          content: 'tableCell*'
        }),
        ExtensionTableCell,
        TiptapInteractiveKatexInline,
        TiptapInteractiveImageUploadInline,
        TiptapInteractiveVideoUploadInline,
        TiptapInteractiveAudioUploadInline,
        TiptapInteractiveInsertScriptInline,
        TiptapInteractivePoem,
        mesra,
        TiptapInteractiveReading,
        ExtensionTiptapShortkeys,
        ExtensionThinSpace
      ],
      // triggered on every change
      onUpdate({ editor }) {
        const htmlContent = this.editorOptions.loadBareHtml ? VueTiptapKatexAssist.convertBareHtml(editor.getHTML()) : editor.getHTML()
        vueTiptapKatexInstance.localModelValue = htmlContent
        vueTiptapKatexInstance.newModelValue = VueTiptapKatexAssist.convertToTiptap(htmlContent)
      },
      editorProps: {
        handleKeyDown: (view, event) => {
          if (event.key === 'Enter' && document.querySelector('.mesra.has-focus')) {
            event.preventDefault()
            this.insertPoem(this.editor, '<div class="beit"><div class="mesra"></div><div class="mesra"></div></div>')
            return true
          }
          return false
        }
      }
    }
    this.editor = new Editor(editorConfig)
    this.editor.disabled = true
    this.editor.editorOptions = this.editorOptions
  },
  beforeUnmount() {
    if (!this.editor) {
      return
    }
    this.editor.destroy()
  },
  methods: {
    updateTableStyle(data) {
      this.editor.commands.setCellAttribute('backgroundColor', data.background.color)
      this.editor.commands.setCellAttribute('borderBottom', this.convertTableStyleToCss(data.bottom))
      this.editor.commands.setCellAttribute('borderLeft', this.convertTableStyleToCss(data.left))
      this.editor.commands.setCellAttribute('borderRight', this.convertTableStyleToCss(data.right))
      this.editor.commands.setCellAttribute('borderTop', this.convertTableStyleToCss(data.top))
    },
    convertTableStyleToCss(data) {
      if (data.cellBorderType === 'none') {
        return 'none'
      }
      return `${data.cellBorderWidth}px ${data.cellBorderType} ${data.color}`
    },
    elementFromString(value) {
      const element = document.createElement('div')
      element.innerHTML = value.trim()

      return element
    },
    insertPoem({ state, view }, value) {
      const element = this.elementFromString(value)
      const slice = DOMParser.fromSchema(state.schema).parseSlice(element)
      const { tr } = state
      let trx = tr
      trx = trx.insert(state.doc.content.size, slice.content)
      view.dispatch(trx)
    },
    setContent(pureHTML) {
      const string = VueTiptapKatexAssist.convertToTiptap(pureHTML)
      // const oldanchor = this.editor.state.tr.selection.anchor
      if (string.length) {
        this.editor.commands.setContent(string)
      }
      // this.editor.commands.focus(oldanchor)
    },
    getContent() {
      return this.editor.getHTML()
    }
  }
}
</script>

<style lang="scss">
/* Basic editor styles */
@import "../../../node_modules/vue3-tiptap-katex/src/css/base-editor-style";
</style>

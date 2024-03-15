<template>
  <div
    v-if="editor && isToolbarReady"
    class="tiptap-toolbar"
  >
    <!--        IMPORTANT : EACH TOOLBAR ITEM'S ID SHOULD BE IN THIS FORM : toolbar-item-(if more than 2 words , use "-") -->
    <ul>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Add-Formula"
          @click="editor.chain().focus().insertContent(`<span data-katex='true'></span> `).run()"
        >
          <span
            class="mdi mdi-sigma  toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div class="vl" />
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Bold"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <span
            class="mdi mdi-format-bold toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div
          id="toolbar-item-Italic"
          class="toolbar-item"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <span
            class="mdi mdi-format-italic toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Underline"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <span
            class="mdi mdi-format-underline toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Line-Through"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <span
            class="mdi mdi-format-strikethrough toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Highlight"
          @click="editor.chain().focus().toggleHighlight().run()"
        >
          <span
            class="mdi mdi-format-color-highlight toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <input
          class="toolbar-item"
          id="toolbar-item-set-color"
          type="color"
          @input="editor.chain().focus().setColor($event.target.value).run()"
          :value="getInputValue"
        >
      </li>
      <li>
        <div class="vl" />
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Unordered-List"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <span
            class="mdi mdi-format-list-bulleted toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Ordered-List"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <span
            class="mdi mdi-format-list-numbered toolbar-item-icon"
          />
        </div>
      </li>
      <li>
        <div
          class="toolbar-item"
          id="toolbar-item-Horizontal-Divider"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
          <span
            class="mdi mdi-arrow-split-horizontal toolbar-item-icon"
          />
        </div>
      </li>
    </ul>
    <interactive-info-table @closedialog="dialog = false" :dialog="dialog"></interactive-info-table>
  </div>
</template>

<script>
import InteractiveInfoTable from '../../../node_modules/vue-tiptap-katex-core/components/tipTapInteractiveInfoTable.vue';

let Tippy
import 'tippy.js/dist/tippy.css'; // optional for styling
import '../../../node_modules/vue-tiptap-katex-core/css/toolbar-Item.scss'

export default {
  name: 'Toolbar',
  components: {
    InteractiveInfoTable
  },
  data() {
    return {
      dialog: false,
      isToolbarReady: false
    }
  },
  mounted() {
    if (typeof window !== 'undefined') {
      import('tippy.js')
        .then((response) => {
          Tippy = response.default
          this.isToolbarReady = true
          this.$nextTick(() => {
            this.setAllTooltips()
          })
        })
    }
  },
  props: {
    editor: {
      type: Object,
      default: () => {
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          poem: false
        }
      }
    }
  },
  computed: {
    getInputValue () {
      let rgbColor = this.editor.getAttributes('textStyle').color
      if (rgbColor && !rgbColor.includes('#')) {
        rgbColor = rgbColor.replace('rgb(','').replace(')','')
        rgbColor = rgbColor.split(', ')
        return this.rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2])
      }
      else if (!rgbColor) {
        return '#000000'
      }
      return this.editor.getAttributes('textStyle').color
    }
  },
  methods: {
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }

      // update link
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    },
    setAllTooltips(){
      var toolbarItems = this.getAllToolbarItems()
      toolbarItems.forEach((item) => {
        var name = this.getToolbarItemName(item.id)
        this.setTippyForEl(item.id , name)
      })
    },
    getAllToolbarItems(){
      return document.querySelectorAll('li .toolbar-item')
    },
    getToolbarItemName(itemId){
      return itemId.replace('toolbar-item-', '').replace('-' , ' ')
    },
    setTippyForEl(itemId , content){
      Tippy('#' + itemId , {
        content: content,
      })
    },
    rgbToHex(r, g, b) {
      return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
    }
  }
}
</script>

<style scoped lang="scss">

.vl {
  border-left: 1px dotted gray;
  white-space: nowrap;
  display: inline;
  margin-right: 12px;
  margin-left: 12px;
  padding-top: 12px;
  padding-bottom: 3px;
}

button:not(.v-btn) {
  border: solid 1px gray;
  padding: 5px;
  margin: 2px;
}

.formula-menu {
  border-radius: 5px !important;
}

.formula-menu .v-list-item,
.formula-menu .v-list {
  padding: 0;
}
</style>

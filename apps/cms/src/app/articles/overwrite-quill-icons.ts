import Quill, { StringMap } from 'quill';

const icons: StringMap = Quill.import('ui/icons');
icons['divider'] = '<span class="material-icons">horizontal_rule</span>';
icons['bold'] = '<span class="material-icons">format_bold</span>';
icons['italic'] = '<span class="material-icons">format_italic</span>';
icons['underline'] = '<span class="material-icons">format_underlined</span>';
icons['strike'] = '<span class="material-icons">format_strikethrough</span>';
icons['ordered'] = '<span class="material-icons">format_list_numbered</span>';
icons['bullet'] = '<span class="material-icons">format_list_bulleted</span>';
icons['link'] = '<span class="material-icons">link</span>';

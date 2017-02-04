function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
loadCss('/nbextensions/AdrasteaNotebookExtension/main.css')

define(['base/js/namespace',
		'require',
		'codemirror/lib/codemirror',
		'notebook/js/savewidget',
	    'codemirror/mode/python/python',
		'nbextensions/AdrasteaNotebookExtension/modifiedPythonMode'
	   ],
    function (Jupyter, require, CodeMirror, SaveWidget, python, MP) {
        "use strict";

        function _on_load() {
            console.info('AdrasteaNotebookExtension loaded')

            $('#header-container').prepend($('#kernel_indicator_icon').detach())
            $('#kernel_indicator').remove()
            $('#header-container').append($('#notification_area').detach())
            $('#header-container').append($('#maintoolbar-container').detach())
            $('#header-container').append($('#menubar').detach())
            $('#menubar-container').remove()
            console.info($('div#site').height())
            console.info($(window).height())
            console.info($('#header').height())
            console.info($(window).height() - $('#header').height())

            $('div#site').height($(window).height() - $('#header').height());
            setTimeout(function () {
                $('div#site').height($(window).height() - $('#header').height());
            }, 3000)

            $.SaveWidget = SaveWidget
            $.CM = CodeMirror

            var set_save_status = function (msg) {
                switch (msg) {
                case '(autosaved)':
                    msg = '<i class="fa fa-check" aria-hidden="true"></i>'
                    break
                case '(unsaved changes)':
                    msg = '<i class="fa fa-times" aria-hidden="true"></i>'
                    break
                }
                $('span.autosave_status').html(msg)
            }
            set_save_status('(autosaved)')
            SaveWidget.SaveWidget.prototype.set_save_status = set_save_status

            $("#save_widget").on('DOMSubtreeModified', "span.checkpoint_status", function () {
                var msg = $(this).html()
                if (!msg.includes('Last Checkpoint:')) return;
                msg = msg.replace('Last Checkpoint:', '<i class="fa fa-flag-o" aria-hidden="true"> </i>')
                $(this).html(msg)
            });
            $('span.checkpoint_status').html($('span.checkpoint_status').html() + ' ')

            var cells = Jupyter.notebook.get_cells()
            cells.forEach(function (i) {
                i.code_mirror.setOption('mode', 'python')
            })
        }

        return {
            load_ipython_extension: _on_load
        };
    })
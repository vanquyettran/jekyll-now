window.addEventListener("load", function () {
    var input = element("input", null, {
        type: "text",
        style: style({
            width: "calc(100% - 6rem)",
            height: "2rem",
            border: "none",
            "font-size": "16px",
            "text-align": "center",
            "background-color": "#ccc",
            "box-shadow": "none"
        })
    });
    var result = element("div");
    var resultText = element("div", null, {
        style: style({
            "max-height": "40vh",
            "overflow-y": "auto",
            padding: "0 0.5rem"
        })
    });
    appendChildren(result, resultText);
    var form = element("form",
        [
            element("button", "X", {type: "reset", style: style({
                width: "3rem",
                height: "2rem"
            })}, {click: function () {
                if (result.parentNode) {
                    result.parentNode.removeChild(result);
                    input.value = "";
                }
            }}),
            input,
            element("button", "GO", {type: "submit", style: style({
                width: "3rem",
                height: "2rem"
            })})
        ],
        {},
        {
            submit: function (event) {
                event.preventDefault();

                if (input.value) {
                    empty(resultText);
                    resultText.appendChild(element("p", "Loading..."));
                    if (!result.parentNode) {
                        overlay.appendChild(result);
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener("load", function () {
                        empty(resultText);
                        var res = JSON.parse(xhr.responseText);
                        if (res instanceof Array) {
                            res.forEach(function (line) {
                                resultText.appendChild(element("p", line));
                            });
                        } else {
                            resultText.appendChild(element("p", xhr.responseText));
                        }
                    });
                    xhr.addEventListener("error", function () {
                        empty(resultText);
                        resultText.appendChild(element("p", "Unexpected error!"));
                    });
                    xhr.open("GET", "https://traxanhthainguyen.com/test/translate?word=" + input.value);
                    xhr.send();
                }
            }
        }
    );
    var overlay = element("div", form,
        {
            style: style({
                position: "fixed",
                bottom: 0,
                right: 0,
                background: "#eee",
                width: "100%",
                "z-index": 1000,
                "max-width": "480px",
                margin: "auto"
            })
        }
    );
    document.body.appendChild(overlay);
});






function element(nodeName, content, attributes, eventListeners) {
        var node = document.createElement(nodeName);
        appendChildren(node, content);
        setAttributes(node, attributes);
        addEventListeners(node, eventListeners);
        return node;
    }

    function appendChildren(node, content) {
        var append = function (t) {
            if ("string" == typeof t) {
                node.innerHTML += t;
            } else if (t instanceof HTMLElement) {
                node.appendChild(t);
            }
        };
        if (content instanceof Array) {
            content.forEach(function (item) {
                append(item);
            });
        } else {
            append(content);
        }
    }

    function setAttributes(node, attributes) {
        if (attributes) {
            var attrName;
            for (attrName in attributes) {
                if (attributes.hasOwnProperty(attrName)) {
                    node.setAttribute(attrName, attributes[attrName]);
                }
            }
        }
    }

    function addEventListeners(node, listeners) {
        if (listeners) {
            var eventName;
            for (eventName in listeners) {
                if (listeners.hasOwnProperty(eventName)) {
                    if (listeners[eventName] instanceof Array) {
                        listeners[eventName].forEach(function (listener) {
                            node.addEventListener(eventName, listener);
                        });
                    } else {
                        node.addEventListener(eventName, listeners[eventName]);
                    }
                }
            }
        }
    }

    function empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function style(obj) {
        var result_array = [];
        var attrName;
        for (attrName in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attrName)) {
                result_array.push(attrName + ":" + obj[attrName]);
            }
        }
        return result_array.join(";");
    }

    function isContains(root, elem) {
        if (root.contains(elem)) {
            return true;
        } else {
            return [].some.call(root.children, function (child) {
                return isContains(child, elem);
            });
        }
    }

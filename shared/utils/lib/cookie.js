var cookie = (function(doc) {
  return {
		get: function (name) {
			var cookieName = encodeURIComponent(name) + "=",
				cookieStart = doc.cookie.indexOf(cookieName),
				cookieEnd = doc.cookie.indexOf(';', cookieStart),
				cookieValue = null;

			if (cookieStart > -1) {
				if (cookieEnd === -1) {
					cookieEnd = doc.cookie.length;
				}
				cookieValue = decodeURIComponent(doc.cookie.substring(cookieStart +
					cookieName.length, cookieEnd));
			}
			return cookieValue;
		},
		set: function (name, value, path, domain, expires, secure) {
			var cookieText = encodeURIComponent(name) + "=" +
				encodeURIComponent(value);

			if (expires instanceof Date) {
				cookieText += "; expires =" + expires.toGMTString();
			}
			if (path) {
				cookieText += "; path =" + path;
			}
			if (domain) {
				cookieText += "; domain =" + domain;
			}
			if (secure) {
				cookieText += "; secure =" + secure;
			}
			doc.cookie = cookieText;

		},
		unset: function (name, path, domain, secure) {
			this.set(name, '', path, domain, new Date(0), secure);
		}
	};

})(document)

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = cookie;
}

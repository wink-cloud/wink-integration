var commonjsGlobal =
  "undefined" != typeof globalThis
    ? globalThis
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self
    ? self
    : {};
var refreshButtonInterval;

function createCommonjsModule(e) {
  var t = { exports: {} };
  return e(t, t.exports), t.exports;
}
var strictUriEncode = (e) =>
    encodeURIComponent(e).replace(
      /[!'()*]/g,
      (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
    ),
  token = "%[a-f0-9]{2}",
  singleMatcher = new RegExp(token, "gi"),
  multiMatcher = new RegExp("(" + token + ")+", "gi");
function decodeComponents(e, t) {
  try {
    return decodeURIComponent(e.join(""));
  } catch (e) {}
  if (1 === e.length) return e;
  var r = e.slice(0, (t = t || 1)),
    o = e.slice(t);
  return Array.prototype.concat.call(
    [],
    decodeComponents(r),
    decodeComponents(o)
  );
}
function decode(e) {
  try {
    return decodeURIComponent(e);
  } catch (o) {
    for (var t = e.match(singleMatcher), r = 1; r < t.length; r++)
      t = (e = decodeComponents(t, r).join("")).match(singleMatcher);
    return e;
  }
}
function customDecodeURIComponent(e) {
  for (
    var t = { "%FE%FF": "  ", "%FF%FE": "  " }, r = multiMatcher.exec(e);
    r;

  ) {
    try {
      t[r[0]] = decodeURIComponent(r[0]);
    } catch (e) {
      var o = decode(r[0]);
      o !== r[0] && (t[r[0]] = o);
    }
    r = multiMatcher.exec(e);
  }
  t["%C2"] = " ";
  for (var n = Object.keys(t), i = 0; i < n.length; i++) {
    var s = n[i];
    e = e.replace(new RegExp(s, "g"), t[s]);
  }
  return e;
}
var decodeUriComponent = function (e) {
    if ("string" != typeof e)
      throw new TypeError(
        "Expected `encodedURI` to be of type `string`, got `" + typeof e + "`"
      );
    try {
      return (e = e.replace(/\+/g, " ")), decodeURIComponent(e);
    } catch (t) {
      return customDecodeURIComponent(e);
    }
  },
  splitOnFirst = (e, t) => {
    if ("string" != typeof e || "string" != typeof t)
      throw new TypeError("Expected the arguments to be of type `string`");
    if ("" === t) return [e];
    const r = e.indexOf(t);
    return -1 === r ? [e] : [e.slice(0, r), e.slice(r + t.length)];
  },
  filterObj = function (e, t) {
    for (
      var r = {}, o = Object.keys(e), n = Array.isArray(t), i = 0;
      i < o.length;
      i++
    ) {
      var s = o[i],
        a = e[s];
      (n ? -1 !== t.indexOf(s) : t(s, a, e)) && (r[s] = a);
    }
    return r;
  };
createCommonjsModule(function (e, t) {
  const r = Symbol("encodeFragmentIdentifier");
  function o(e) {
    if ("string" != typeof e || 1 !== e.length)
      throw new TypeError(
        "arrayFormatSeparator must be single character string"
      );
  }
  function n(e, t) {
    return t.encode
      ? t.strict
        ? strictUriEncode(e)
        : encodeURIComponent(e)
      : e;
  }
  function i(e, t) {
    return t.decode ? decodeUriComponent(e) : e;
  }
  function s(e) {
    return Array.isArray(e)
      ? e.sort()
      : "object" == typeof e
      ? s(Object.keys(e))
          .sort((e, t) => Number(e) - Number(t))
          .map((t) => e[t])
      : e;
  }
  function a(e) {
    const t = e.indexOf("#");
    return -1 !== t && (e = e.slice(0, t)), e;
  }
  function c(e) {
    const t = (e = a(e)).indexOf("?");
    return -1 === t ? "" : e.slice(t + 1);
  }
  function u(e, t) {
    return (
      t.parseNumbers &&
      !Number.isNaN(Number(e)) &&
      "string" == typeof e &&
      "" !== e.trim()
        ? (e = Number(e))
        : !t.parseBooleans ||
          null === e ||
          ("true" !== e.toLowerCase() && "false" !== e.toLowerCase()) ||
          (e = "true" === e.toLowerCase()),
      e
    );
  }
  function l(e, t) {
    o(
      (t = Object.assign(
        {
          decode: !0,
          sort: !0,
          arrayFormat: "none",
          arrayFormatSeparator: ",",
          parseNumbers: !1,
          parseBooleans: !1,
        },
        t
      )).arrayFormatSeparator
    );
    const r = (function (e) {
        let t;
        switch (e.arrayFormat) {
          case "index":
            return (e, r, o) => {
              (t = /\[(\d*)\]$/.exec(e)),
                (e = e.replace(/\[\d*\]$/, "")),
                t
                  ? (void 0 === o[e] && (o[e] = {}), (o[e][t[1]] = r))
                  : (o[e] = r);
            };
          case "bracket":
            return (e, r, o) => {
              (t = /(\[\])$/.exec(e)),
                (o[(e = e.replace(/\[\]$/, ""))] = t
                  ? void 0 !== o[e]
                    ? [].concat(o[e], r)
                    : [r]
                  : r);
            };
          case "colon-list-separator":
            return (e, r, o) => {
              (t = /(:list)$/.exec(e)),
                (o[(e = e.replace(/:list$/, ""))] = t
                  ? void 0 !== o[e]
                    ? [].concat(o[e], r)
                    : [r]
                  : r);
            };
          case "comma":
          case "separator":
            return (t, r, o) => {
              const n =
                  "string" == typeof r && r.includes(e.arrayFormatSeparator),
                s =
                  "string" == typeof r &&
                  !n &&
                  i(r, e).includes(e.arrayFormatSeparator);
              r = s ? i(r, e) : r;
              const a =
                n || s
                  ? r.split(e.arrayFormatSeparator).map((t) => i(t, e))
                  : null === r
                  ? r
                  : i(r, e);
              o[t] = a;
            };
          case "bracket-separator":
            return (t, r, o) => {
              const n = /(\[\])$/.test(t);
              if (((t = t.replace(/\[\]$/, "")), !n))
                return void (o[t] = r ? i(r, e) : r);
              const s =
                null === r
                  ? []
                  : r.split(e.arrayFormatSeparator).map((t) => i(t, e));
              o[t] = void 0 !== o[t] ? [].concat(o[t], s) : s;
            };
          default:
            return (e, t, r) => {
              r[e] = void 0 !== r[e] ? [].concat(r[e], t) : t;
            };
        }
      })(t),
      n = Object.create(null);
    if ("string" != typeof e) return n;
    if (!(e = e.trim().replace(/^[?#&]/, ""))) return n;
    for (const o of e.split("&")) {
      if ("" === o) continue;
      let [e, s] = splitOnFirst(t.decode ? o.replace(/\+/g, " ") : o, "=");
      (s =
        void 0 === s
          ? null
          : ["comma", "separator", "bracket-separator"].includes(t.arrayFormat)
          ? s
          : i(s, t)),
        r(i(e, t), s, n);
    }
    for (const e of Object.keys(n)) {
      const r = n[e];
      if ("object" == typeof r && null !== r)
        for (const e of Object.keys(r)) r[e] = u(r[e], t);
      else n[e] = u(r, t);
    }
    return !1 === t.sort
      ? n
      : (!0 === t.sort
          ? Object.keys(n).sort()
          : Object.keys(n).sort(t.sort)
        ).reduce((e, t) => {
          const r = n[t];
          return (
            (e[t] =
              Boolean(r) && "object" == typeof r && !Array.isArray(r)
                ? s(r)
                : r),
            e
          );
        }, Object.create(null));
  }
  (t.extract = c),
    (t.parse = l),
    (t.stringify = (e, t) => {
      if (!e) return "";
      o(
        (t = Object.assign(
          {
            encode: !0,
            strict: !0,
            arrayFormat: "none",
            arrayFormatSeparator: ",",
          },
          t
        )).arrayFormatSeparator
      );
      const r = (r) =>
          (t.skipNull && null == e[r]) || (t.skipEmptyString && "" === e[r]),
        i = (function (e) {
          switch (e.arrayFormat) {
            case "index":
              return (t) => (r, o) => {
                const i = r.length;
                return void 0 === o ||
                  (e.skipNull && null === o) ||
                  (e.skipEmptyString && "" === o)
                  ? r
                  : null === o
                  ? [...r, [n(t, e), "[", i, "]"].join("")]
                  : [...r, [n(t, e), "[", n(i, e), "]=", n(o, e)].join("")];
              };
            case "bracket":
              return (t) => (r, o) =>
                void 0 === o ||
                (e.skipNull && null === o) ||
                (e.skipEmptyString && "" === o)
                  ? r
                  : null === o
                  ? [...r, [n(t, e), "[]"].join("")]
                  : [...r, [n(t, e), "[]=", n(o, e)].join("")];
            case "colon-list-separator":
              return (t) => (r, o) =>
                void 0 === o ||
                (e.skipNull && null === o) ||
                (e.skipEmptyString && "" === o)
                  ? r
                  : null === o
                  ? [...r, [n(t, e), ":list="].join("")]
                  : [...r, [n(t, e), ":list=", n(o, e)].join("")];
            case "comma":
            case "separator":
            case "bracket-separator": {
              const t = "bracket-separator" === e.arrayFormat ? "[]=" : "=";
              return (r) => (o, i) =>
                void 0 === i ||
                (e.skipNull && null === i) ||
                (e.skipEmptyString && "" === i)
                  ? o
                  : ((i = null === i ? "" : i),
                    0 === o.length
                      ? [[n(r, e), t, n(i, e)].join("")]
                      : [[o, n(i, e)].join(e.arrayFormatSeparator)]);
            }
            default:
              return (t) => (r, o) =>
                void 0 === o ||
                (e.skipNull && null === o) ||
                (e.skipEmptyString && "" === o)
                  ? r
                  : null === o
                  ? [...r, n(t, e)]
                  : [...r, [n(t, e), "=", n(o, e)].join("")];
          }
        })(t),
        s = {};
      for (const t of Object.keys(e)) r(t) || (s[t] = e[t]);
      const a = Object.keys(s);
      return (
        !1 !== t.sort && a.sort(t.sort),
        a
          .map((r) => {
            const o = e[r];
            return void 0 === o
              ? ""
              : null === o
              ? n(r, t)
              : Array.isArray(o)
              ? 0 === o.length && "bracket-separator" === t.arrayFormat
                ? n(r, t) + "[]"
                : o.reduce(i(r), []).join("&")
              : n(r, t) + "=" + n(o, t);
          })
          .filter((e) => e.length > 0)
          .join("&")
      );
    }),
    (t.parseUrl = (e, t) => {
      t = Object.assign({ decode: !0 }, t);
      const [r, o] = splitOnFirst(e, "#");
      return Object.assign(
        { url: r.split("?")[0] || "", query: l(c(e), t) },
        t && t.parseFragmentIdentifier && o
          ? { fragmentIdentifier: i(o, t) }
          : {}
      );
    }),
    (t.stringifyUrl = (e, o) => {
      o = Object.assign({ encode: !0, strict: !0, [r]: !0 }, o);
      const i = a(e.url).split("?")[0] || "",
        s = t.extract(e.url),
        c = t.parse(s, { sort: !1 }),
        u = Object.assign(c, e.query);
      let l = t.stringify(u, o);
      l && (l = `?${l}`);
      let d = (function (e) {
        let t = "";
        const r = e.indexOf("#");
        return -1 !== r && (t = e.slice(r)), t;
      })(e.url);
      return (
        e.fragmentIdentifier &&
          (d = `#${o[r] ? n(e.fragmentIdentifier, o) : e.fragmentIdentifier}`),
        `${i}${l}${d}`
      );
    }),
    (t.pick = (e, o, n) => {
      n = Object.assign({ parseFragmentIdentifier: !0, [r]: !1 }, n);
      const { url: i, query: s, fragmentIdentifier: a } = t.parseUrl(e, n);
      return t.stringifyUrl(
        { url: i, query: filterObj(s, o), fragmentIdentifier: a },
        n
      );
    }),
    (t.exclude = (e, r, o) => {
      const n = Array.isArray(r) ? (e) => !r.includes(e) : (e, t) => !r(e, t);
      return t.pick(e, n, o);
    });
});
for (
  var css_248z =
      ".wink-oauth-button{background:blue;border:none;color:#fff;cursor:pointer;font-family:Roboto,arial,sans-serif;font-size:14px;font-weight:500;letter-spacing:.21px;line-height:48px;margin:6px;padding:0 20px;text-decoration:none;vertical-align:top}.wink-oauth-button:hover{background-color:#0000bc}",
    byteLength_1 = byteLength,
    toByteArray_1 = toByteArray,
    fromByteArray_1 = fromByteArray,
    lookup = [],
    revLookup = [],
    Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array,
    code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    i = 0,
    len = code.length;
  i < len;
  ++i
)
  (lookup[i] = code[i]), (revLookup[code.charCodeAt(i)] = i);
function getLens(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var r = e.indexOf("=");
  return -1 === r && (r = t), [r, r === t ? 0 : 4 - (r % 4)];
}
function byteLength(e) {
  var t = getLens(e),
    r = t[1];
  return (3 * (t[0] + r)) / 4 - r;
}
function _byteLength(e, t, r) {
  return (3 * (t + r)) / 4 - r;
}
function toByteArray(e) {
  var t,
    r,
    o = getLens(e),
    n = o[0],
    i = o[1],
    s = new Arr(_byteLength(e, n, i)),
    a = 0,
    c = i > 0 ? n - 4 : n;
  for (r = 0; r < c; r += 4)
    (t =
      (revLookup[e.charCodeAt(r)] << 18) |
      (revLookup[e.charCodeAt(r + 1)] << 12) |
      (revLookup[e.charCodeAt(r + 2)] << 6) |
      revLookup[e.charCodeAt(r + 3)]),
      (s[a++] = (t >> 16) & 255),
      (s[a++] = (t >> 8) & 255),
      (s[a++] = 255 & t);
  return (
    2 === i &&
      ((t =
        (revLookup[e.charCodeAt(r)] << 2) |
        (revLookup[e.charCodeAt(r + 1)] >> 4)),
      (s[a++] = 255 & t)),
    1 === i &&
      ((t =
        (revLookup[e.charCodeAt(r)] << 10) |
        (revLookup[e.charCodeAt(r + 1)] << 4) |
        (revLookup[e.charCodeAt(r + 2)] >> 2)),
      (s[a++] = (t >> 8) & 255),
      (s[a++] = 255 & t)),
    s
  );
}
function tripletToBase64(e) {
  return (
    lookup[(e >> 18) & 63] +
    lookup[(e >> 12) & 63] +
    lookup[(e >> 6) & 63] +
    lookup[63 & e]
  );
}
function encodeChunk(e, t, r) {
  for (var o = [], n = t; n < r; n += 3)
    o.push(
      tripletToBase64(
        ((e[n] << 16) & 16711680) + ((e[n + 1] << 8) & 65280) + (255 & e[n + 2])
      )
    );
  return o.join("");
}
function fromByteArray(e) {
  for (
    var t, r = e.length, o = r % 3, n = [], i = 16383, s = 0, a = r - o;
    s < a;
    s += i
  )
    n.push(encodeChunk(e, s, s + i > a ? a : s + i));
  return (
    1 === o
      ? n.push(lookup[(t = e[r - 1]) >> 2] + lookup[(t << 4) & 63] + "==")
      : 2 === o &&
        n.push(
          lookup[(t = (e[r - 2] << 8) + e[r - 1]) >> 10] +
            lookup[(t >> 4) & 63] +
            lookup[(t << 2) & 63] +
            "="
        ),
    n.join("")
  );
}
(revLookup["-".charCodeAt(0)] = 62), (revLookup["_".charCodeAt(0)] = 63);
var base64Js = {
    byteLength: byteLength_1,
    toByteArray: toByteArray_1,
    fromByteArray: fromByteArray_1,
  },
  sha256 = createCommonjsModule(function (module) {
    (function () {
      var ERROR = "input is invalid type",
        WINDOW = "object" == typeof window,
        root = WINDOW ? window : {};
      root.JS_SHA256_NO_WINDOW && (WINDOW = !1);
      var WEB_WORKER = !WINDOW && "object" == typeof self,
        NODE_JS =
          !root.JS_SHA256_NO_NODE_JS &&
          "object" == typeof process &&
          process.versions &&
          process.versions.node;
      NODE_JS ? (root = commonjsGlobal) : WEB_WORKER && (root = self);
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && module.exports,
        ARRAY_BUFFER =
          !root.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
        HEX_CHARS = "0123456789abcdef".split(""),
        EXTRA = [-2147483648, 8388608, 32768, 128],
        SHIFT = [24, 16, 8, 0],
        K = [
          1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
          2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
          1925078388, 2162078206, 2614888103, 3248222580, 3835390401,
          4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692,
          1996064986, 2554220882, 2821834349, 2952996808, 3210313671,
          3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912,
          1294757372, 1396182291, 1695183700, 1986661051, 2177026350,
          2456956037, 2730485921, 2820302411, 3259730800, 3345764771,
          3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616,
          659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
          1955562222, 2024104815, 2227730452, 2361852424, 2428436474,
          2756734187, 3204031479, 3329325298,
        ],
        OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"],
        blocks = [];
      (!root.JS_SHA256_NO_NODE_JS && Array.isArray) ||
        (Array.isArray = function (e) {
          return "[object Array]" === Object.prototype.toString.call(e);
        }),
        !ARRAY_BUFFER ||
          (!root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
          (ArrayBuffer.isView = function (e) {
            return (
              "object" == typeof e &&
              e.buffer &&
              e.buffer.constructor === ArrayBuffer
            );
          });
      var createOutputMethod = function (e, t) {
          return function (r) {
            return new Sha256(t, !0).update(r)[e]();
          };
        },
        createMethod = function (e) {
          var t = createOutputMethod("hex", e);
          NODE_JS && (t = nodeWrap(t, e)),
            (t.create = function () {
              return new Sha256(e);
            }),
            (t.update = function (e) {
              return t.create().update(e);
            });
          for (var r = 0; r < OUTPUT_TYPES.length; ++r) {
            var o = OUTPUT_TYPES[r];
            t[o] = createOutputMethod(o, e);
          }
          return t;
        },
        nodeWrap = function (method, is224) {
          var crypto = eval("require('crypto')"),
            Buffer = eval("require('buffer').Buffer"),
            algorithm = is224 ? "sha224" : "sha256",
            nodeMethod = function (e) {
              if ("string" == typeof e)
                return crypto
                  .createHash(algorithm)
                  .update(e, "utf8")
                  .digest("hex");
              if (null == e) throw new Error(ERROR);
              return (
                e.constructor === ArrayBuffer && (e = new Uint8Array(e)),
                Array.isArray(e) ||
                ArrayBuffer.isView(e) ||
                e.constructor === Buffer
                  ? crypto
                      .createHash(algorithm)
                      .update(new Buffer(e))
                      .digest("hex")
                  : method(e)
              );
            };
          return nodeMethod;
        },
        createHmacOutputMethod = function (e, t) {
          return function (r, o) {
            return new HmacSha256(r, t, !0).update(o)[e]();
          };
        },
        createHmacMethod = function (e) {
          var t = createHmacOutputMethod("hex", e);
          (t.create = function (t) {
            return new HmacSha256(t, e);
          }),
            (t.update = function (e, r) {
              return t.create(e).update(r);
            });
          for (var r = 0; r < OUTPUT_TYPES.length; ++r) {
            var o = OUTPUT_TYPES[r];
            t[o] = createHmacOutputMethod(o, e);
          }
          return t;
        };
      function Sha256(e, t) {
        t
          ? ((blocks[0] =
              blocks[16] =
              blocks[1] =
              blocks[2] =
              blocks[3] =
              blocks[4] =
              blocks[5] =
              blocks[6] =
              blocks[7] =
              blocks[8] =
              blocks[9] =
              blocks[10] =
              blocks[11] =
              blocks[12] =
              blocks[13] =
              blocks[14] =
              blocks[15] =
                0),
            (this.blocks = blocks))
          : (this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          e
            ? ((this.h0 = 3238371032),
              (this.h1 = 914150663),
              (this.h2 = 812702999),
              (this.h3 = 4144912697),
              (this.h4 = 4290775857),
              (this.h5 = 1750603025),
              (this.h6 = 1694076839),
              (this.h7 = 3204075428))
            : ((this.h0 = 1779033703),
              (this.h1 = 3144134277),
              (this.h2 = 1013904242),
              (this.h3 = 2773480762),
              (this.h4 = 1359893119),
              (this.h5 = 2600822924),
              (this.h6 = 528734635),
              (this.h7 = 1541459225)),
          (this.block = this.start = this.bytes = this.hBytes = 0),
          (this.finalized = this.hashed = !1),
          (this.first = !0),
          (this.is224 = e);
      }
      function HmacSha256(e, t, r) {
        var o,
          n = typeof e;
        if ("string" === n) {
          var i,
            s = [],
            a = e.length,
            c = 0;
          for (o = 0; o < a; ++o)
            (i = e.charCodeAt(o)) < 128
              ? (s[c++] = i)
              : i < 2048
              ? ((s[c++] = 192 | (i >> 6)), (s[c++] = 128 | (63 & i)))
              : i < 55296 || i >= 57344
              ? ((s[c++] = 224 | (i >> 12)),
                (s[c++] = 128 | ((i >> 6) & 63)),
                (s[c++] = 128 | (63 & i)))
              : ((i =
                  65536 + (((1023 & i) << 10) | (1023 & e.charCodeAt(++o)))),
                (s[c++] = 240 | (i >> 18)),
                (s[c++] = 128 | ((i >> 12) & 63)),
                (s[c++] = 128 | ((i >> 6) & 63)),
                (s[c++] = 128 | (63 & i)));
          e = s;
        } else {
          if ("object" !== n) throw new Error(ERROR);
          if (null === e) throw new Error(ERROR);
          if (ARRAY_BUFFER && e.constructor === ArrayBuffer)
            e = new Uint8Array(e);
          else if (
            !(Array.isArray(e) || (ARRAY_BUFFER && ArrayBuffer.isView(e)))
          )
            throw new Error(ERROR);
        }
        e.length > 64 && (e = new Sha256(t, !0).update(e).array());
        var u = [],
          l = [];
        for (o = 0; o < 64; ++o) {
          var d = e[o] || 0;
          (u[o] = 92 ^ d), (l[o] = 54 ^ d);
        }
        Sha256.call(this, t, r),
          this.update(l),
          (this.oKeyPad = u),
          (this.inner = !0),
          (this.sharedMemory = r);
      }
      (Sha256.prototype.update = function (e) {
        if (!this.finalized) {
          var t,
            r = typeof e;
          if ("string" !== r) {
            if ("object" !== r) throw new Error(ERROR);
            if (null === e) throw new Error(ERROR);
            if (ARRAY_BUFFER && e.constructor === ArrayBuffer)
              e = new Uint8Array(e);
            else if (
              !(Array.isArray(e) || (ARRAY_BUFFER && ArrayBuffer.isView(e)))
            )
              throw new Error(ERROR);
            t = !0;
          }
          for (var o, n, i = 0, s = e.length, a = this.blocks; i < s; ) {
            if (
              (this.hashed &&
                ((this.hashed = !1),
                (a[0] = this.block),
                (a[16] =
                  a[1] =
                  a[2] =
                  a[3] =
                  a[4] =
                  a[5] =
                  a[6] =
                  a[7] =
                  a[8] =
                  a[9] =
                  a[10] =
                  a[11] =
                  a[12] =
                  a[13] =
                  a[14] =
                  a[15] =
                    0)),
              t)
            )
              for (n = this.start; i < s && n < 64; ++i)
                a[n >> 2] |= e[i] << SHIFT[3 & n++];
            else
              for (n = this.start; i < s && n < 64; ++i)
                (o = e.charCodeAt(i)) < 128
                  ? (a[n >> 2] |= o << SHIFT[3 & n++])
                  : o < 2048
                  ? ((a[n >> 2] |= (192 | (o >> 6)) << SHIFT[3 & n++]),
                    (a[n >> 2] |= (128 | (63 & o)) << SHIFT[3 & n++]))
                  : o < 55296 || o >= 57344
                  ? ((a[n >> 2] |= (224 | (o >> 12)) << SHIFT[3 & n++]),
                    (a[n >> 2] |= (128 | ((o >> 6) & 63)) << SHIFT[3 & n++]),
                    (a[n >> 2] |= (128 | (63 & o)) << SHIFT[3 & n++]))
                  : ((o =
                      65536 +
                      (((1023 & o) << 10) | (1023 & e.charCodeAt(++i)))),
                    (a[n >> 2] |= (240 | (o >> 18)) << SHIFT[3 & n++]),
                    (a[n >> 2] |= (128 | ((o >> 12) & 63)) << SHIFT[3 & n++]),
                    (a[n >> 2] |= (128 | ((o >> 6) & 63)) << SHIFT[3 & n++]),
                    (a[n >> 2] |= (128 | (63 & o)) << SHIFT[3 & n++]));
            (this.lastByteIndex = n),
              (this.bytes += n - this.start),
              n >= 64
                ? ((this.block = a[16]),
                  (this.start = n - 64),
                  this.hash(),
                  (this.hashed = !0))
                : (this.start = n);
          }
          return (
            this.bytes > 4294967295 &&
              ((this.hBytes += (this.bytes / 4294967296) << 0),
              (this.bytes = this.bytes % 4294967296)),
            this
          );
        }
      }),
        (Sha256.prototype.finalize = function () {
          if (!this.finalized) {
            this.finalized = !0;
            var e = this.blocks,
              t = this.lastByteIndex;
            (e[16] = this.block),
              (e[t >> 2] |= EXTRA[3 & t]),
              (this.block = e[16]),
              t >= 56 &&
                (this.hashed || this.hash(),
                (e[0] = this.block),
                (e[16] =
                  e[1] =
                  e[2] =
                  e[3] =
                  e[4] =
                  e[5] =
                  e[6] =
                  e[7] =
                  e[8] =
                  e[9] =
                  e[10] =
                  e[11] =
                  e[12] =
                  e[13] =
                  e[14] =
                  e[15] =
                    0)),
              (e[14] = (this.hBytes << 3) | (this.bytes >>> 29)),
              (e[15] = this.bytes << 3),
              this.hash();
          }
        }),
        (Sha256.prototype.hash = function () {
          var e,
            t,
            r,
            o,
            n,
            i,
            s = this.h0,
            a = this.h1,
            c = this.h2,
            u = this.h3,
            l = this.h4,
            d = this.h5,
            h = this.h6,
            f = this.h7,
            p = this.blocks;
          for (e = 16; e < 64; ++e)
            p[e] =
              (p[e - 16] +
                ((((t = p[e - 15]) >>> 7) | (t << 25)) ^
                  ((t >>> 18) | (t << 14)) ^
                  (t >>> 3)) +
                p[e - 7] +
                ((((t = p[e - 2]) >>> 17) | (t << 15)) ^
                  ((t >>> 19) | (t << 13)) ^
                  (t >>> 10))) <<
              0;
          for (i = a & c, e = 0; e < 64; e += 4)
            this.first
              ? (this.is224
                  ? ((r = 300032),
                    (f = ((t = p[0] - 1413257819) - 150054599) << 0),
                    (u = (t + 24177077) << 0))
                  : ((r = 704751109),
                    (f = ((t = p[0] - 210244248) - 1521486534) << 0),
                    (u = (t + 143694565) << 0)),
                (this.first = !1))
              : ((f =
                  (u +
                    (t =
                      f +
                      (((l >>> 6) | (l << 26)) ^
                        ((l >>> 11) | (l << 21)) ^
                        ((l >>> 25) | (l << 7))) +
                      ((l & d) ^ (~l & h)) +
                      K[e] +
                      p[e])) <<
                  0),
                (u =
                  (t +
                    ((((s >>> 2) | (s << 30)) ^
                      ((s >>> 13) | (s << 19)) ^
                      ((s >>> 22) | (s << 10))) +
                      ((r = s & a) ^ (s & c) ^ i))) <<
                  0)),
              (h =
                (c +
                  (t =
                    h +
                    (((f >>> 6) | (f << 26)) ^
                      ((f >>> 11) | (f << 21)) ^
                      ((f >>> 25) | (f << 7))) +
                    ((f & l) ^ (~f & d)) +
                    K[e + 1] +
                    p[e + 1])) <<
                0),
              (c =
                (t +
                  ((((u >>> 2) | (u << 30)) ^
                    ((u >>> 13) | (u << 19)) ^
                    ((u >>> 22) | (u << 10))) +
                    ((o = u & s) ^ (u & a) ^ r))) <<
                0),
              (d =
                (a +
                  (t =
                    d +
                    (((h >>> 6) | (h << 26)) ^
                      ((h >>> 11) | (h << 21)) ^
                      ((h >>> 25) | (h << 7))) +
                    ((h & f) ^ (~h & l)) +
                    K[e + 2] +
                    p[e + 2])) <<
                0),
              (a =
                (t +
                  ((((c >>> 2) | (c << 30)) ^
                    ((c >>> 13) | (c << 19)) ^
                    ((c >>> 22) | (c << 10))) +
                    ((n = c & u) ^ (c & s) ^ o))) <<
                0),
              (l =
                (s +
                  (t =
                    l +
                    (((d >>> 6) | (d << 26)) ^
                      ((d >>> 11) | (d << 21)) ^
                      ((d >>> 25) | (d << 7))) +
                    ((d & h) ^ (~d & f)) +
                    K[e + 3] +
                    p[e + 3])) <<
                0),
              (s =
                (t +
                  ((((a >>> 2) | (a << 30)) ^
                    ((a >>> 13) | (a << 19)) ^
                    ((a >>> 22) | (a << 10))) +
                    ((i = a & c) ^ (a & u) ^ n))) <<
                0);
          (this.h0 = (this.h0 + s) << 0),
            (this.h1 = (this.h1 + a) << 0),
            (this.h2 = (this.h2 + c) << 0),
            (this.h3 = (this.h3 + u) << 0),
            (this.h4 = (this.h4 + l) << 0),
            (this.h5 = (this.h5 + d) << 0),
            (this.h6 = (this.h6 + h) << 0),
            (this.h7 = (this.h7 + f) << 0);
        }),
        (Sha256.prototype.hex = function () {
          this.finalize();
          var e = this.h0,
            t = this.h1,
            r = this.h2,
            o = this.h3,
            n = this.h4,
            i = this.h5,
            s = this.h6,
            a = this.h7,
            c =
              HEX_CHARS[(e >> 28) & 15] +
              HEX_CHARS[(e >> 24) & 15] +
              HEX_CHARS[(e >> 20) & 15] +
              HEX_CHARS[(e >> 16) & 15] +
              HEX_CHARS[(e >> 12) & 15] +
              HEX_CHARS[(e >> 8) & 15] +
              HEX_CHARS[(e >> 4) & 15] +
              HEX_CHARS[15 & e] +
              HEX_CHARS[(t >> 28) & 15] +
              HEX_CHARS[(t >> 24) & 15] +
              HEX_CHARS[(t >> 20) & 15] +
              HEX_CHARS[(t >> 16) & 15] +
              HEX_CHARS[(t >> 12) & 15] +
              HEX_CHARS[(t >> 8) & 15] +
              HEX_CHARS[(t >> 4) & 15] +
              HEX_CHARS[15 & t] +
              HEX_CHARS[(r >> 28) & 15] +
              HEX_CHARS[(r >> 24) & 15] +
              HEX_CHARS[(r >> 20) & 15] +
              HEX_CHARS[(r >> 16) & 15] +
              HEX_CHARS[(r >> 12) & 15] +
              HEX_CHARS[(r >> 8) & 15] +
              HEX_CHARS[(r >> 4) & 15] +
              HEX_CHARS[15 & r] +
              HEX_CHARS[(o >> 28) & 15] +
              HEX_CHARS[(o >> 24) & 15] +
              HEX_CHARS[(o >> 20) & 15] +
              HEX_CHARS[(o >> 16) & 15] +
              HEX_CHARS[(o >> 12) & 15] +
              HEX_CHARS[(o >> 8) & 15] +
              HEX_CHARS[(o >> 4) & 15] +
              HEX_CHARS[15 & o] +
              HEX_CHARS[(n >> 28) & 15] +
              HEX_CHARS[(n >> 24) & 15] +
              HEX_CHARS[(n >> 20) & 15] +
              HEX_CHARS[(n >> 16) & 15] +
              HEX_CHARS[(n >> 12) & 15] +
              HEX_CHARS[(n >> 8) & 15] +
              HEX_CHARS[(n >> 4) & 15] +
              HEX_CHARS[15 & n] +
              HEX_CHARS[(i >> 28) & 15] +
              HEX_CHARS[(i >> 24) & 15] +
              HEX_CHARS[(i >> 20) & 15] +
              HEX_CHARS[(i >> 16) & 15] +
              HEX_CHARS[(i >> 12) & 15] +
              HEX_CHARS[(i >> 8) & 15] +
              HEX_CHARS[(i >> 4) & 15] +
              HEX_CHARS[15 & i] +
              HEX_CHARS[(s >> 28) & 15] +
              HEX_CHARS[(s >> 24) & 15] +
              HEX_CHARS[(s >> 20) & 15] +
              HEX_CHARS[(s >> 16) & 15] +
              HEX_CHARS[(s >> 12) & 15] +
              HEX_CHARS[(s >> 8) & 15] +
              HEX_CHARS[(s >> 4) & 15] +
              HEX_CHARS[15 & s];
          return (
            this.is224 ||
              (c +=
                HEX_CHARS[(a >> 28) & 15] +
                HEX_CHARS[(a >> 24) & 15] +
                HEX_CHARS[(a >> 20) & 15] +
                HEX_CHARS[(a >> 16) & 15] +
                HEX_CHARS[(a >> 12) & 15] +
                HEX_CHARS[(a >> 8) & 15] +
                HEX_CHARS[(a >> 4) & 15] +
                HEX_CHARS[15 & a]),
            c
          );
        }),
        (Sha256.prototype.toString = Sha256.prototype.hex),
        (Sha256.prototype.digest = function () {
          this.finalize();
          var e = this.h0,
            t = this.h1,
            r = this.h2,
            o = this.h3,
            n = this.h4,
            i = this.h5,
            s = this.h6,
            a = this.h7,
            c = [
              (e >> 24) & 255,
              (e >> 16) & 255,
              (e >> 8) & 255,
              255 & e,
              (t >> 24) & 255,
              (t >> 16) & 255,
              (t >> 8) & 255,
              255 & t,
              (r >> 24) & 255,
              (r >> 16) & 255,
              (r >> 8) & 255,
              255 & r,
              (o >> 24) & 255,
              (o >> 16) & 255,
              (o >> 8) & 255,
              255 & o,
              (n >> 24) & 255,
              (n >> 16) & 255,
              (n >> 8) & 255,
              255 & n,
              (i >> 24) & 255,
              (i >> 16) & 255,
              (i >> 8) & 255,
              255 & i,
              (s >> 24) & 255,
              (s >> 16) & 255,
              (s >> 8) & 255,
              255 & s,
            ];
          return (
            this.is224 ||
              c.push((a >> 24) & 255, (a >> 16) & 255, (a >> 8) & 255, 255 & a),
            c
          );
        }),
        (Sha256.prototype.array = Sha256.prototype.digest),
        (Sha256.prototype.arrayBuffer = function () {
          this.finalize();
          var e = new ArrayBuffer(this.is224 ? 28 : 32),
            t = new DataView(e);
          return (
            t.setUint32(0, this.h0),
            t.setUint32(4, this.h1),
            t.setUint32(8, this.h2),
            t.setUint32(12, this.h3),
            t.setUint32(16, this.h4),
            t.setUint32(20, this.h5),
            t.setUint32(24, this.h6),
            this.is224 || t.setUint32(28, this.h7),
            e
          );
        }),
        (HmacSha256.prototype = new Sha256()),
        (HmacSha256.prototype.finalize = function () {
          if ((Sha256.prototype.finalize.call(this), this.inner)) {
            this.inner = !1;
            var e = this.array();
            Sha256.call(this, this.is224, this.sharedMemory),
              this.update(this.oKeyPad),
              this.update(e),
              Sha256.prototype.finalize.call(this);
          }
        });
      var exports = createMethod();
      (exports.sha256 = exports),
        (exports.sha224 = createMethod(!0)),
        (exports.sha256.hmac = createHmacMethod()),
        (exports.sha224.hmac = createHmacMethod(!0)),
        COMMON_JS
          ? (module.exports = exports)
          : ((root.sha256 = exports.sha256), (root.sha224 = exports.sha224));
    })();
  });
if ("undefined" == typeof Promise)
  throw Error(
    "Keycloak requires an environment that supports Promises. Make sure that you include the appropriate polyfill."
  );
var loggedPromiseDeprecation = !1;
function logPromiseDeprecation() {
  loggedPromiseDeprecation ||
    ((loggedPromiseDeprecation = !0),
    console.warn(
      "[KEYCLOAK] Usage of legacy style promise methods such as `.error()` and `.success()` has been deprecated and support will be removed in future versions. Use standard style promise methods such as `.then() and `.catch()` instead."
    ));
}
function Keycloak(e) {
  if (!(this instanceof Keycloak)) return new Keycloak(e);
  for (
    var t,
      r,
      o = this,
      n = [],
      i = { enable: !0, callbackList: [], interval: 5 },
      s = document.getElementsByTagName("script"),
      a = 0;
    a < s.length;
    a++
  )
    (-1 === s[a].src.indexOf("keycloak.js") &&
      -1 === s[a].src.indexOf("keycloak.min.js")) ||
      -1 === s[a].src.indexOf("version=") ||
      (o.iframeVersion = s[a].src
        .substring(s[a].src.indexOf("version=") + 8)
        .split("&")[0]);
  var c = !0,
    u = H(console.info),
    l = H(console.warn);
  function d(e, t) {
    for (
      var r = (function (e) {
          var t = null,
            r = window.crypto || window.msCrypto;
          if (r && r.getRandomValues && window.Uint8Array)
            return (t = new Uint8Array(e)), r.getRandomValues(t), t;
          t = new Array(e);
          for (var o = 0; o < t.length; o++)
            t[o] = Math.floor(256 * Math.random());
          return t;
        })(e),
        o = new Array(e),
        n = 0;
      n < e;
      n++
    )
      o[n] = t.charCodeAt(r[n] % t.length);
    return String.fromCharCode.apply(null, o);
  }
  function h() {
    return void 0 !== o.authServerUrl
      ? "/" == o.authServerUrl.charAt(o.authServerUrl.length - 1)
        ? o.authServerUrl + "realms/" + encodeURIComponent(o.realm)
        : o.authServerUrl + "/realms/" + encodeURIComponent(o.realm)
      : void 0;
  }
  function f(e, t) {
    var r = e.code,
      n = e.error,
      i = e.prompt,
      s = new Date().getTime();
    if (
      (e.kc_action_status &&
        o.onActionUpdate &&
        o.onActionUpdate(e.kc_action_status),
      n)
    )
      if ("none" != i) {
        var a = { error: n, error_description: e.error_description };
        o.onAuthError && o.onAuthError(a), t && t.setError(a);
      } else t && t.setSuccess();
    else if (
      ("standard" != o.flow &&
        (e.access_token || e.id_token) &&
        f(e.access_token, null, e.id_token, !0),
      "implicit" != o.flow && r)
    ) {
      var l = "code=" + r + "&grant_type=authorization_code",
        d = o.endpoints.token(),
        h = new XMLHttpRequest();
      h.open("POST", d, !0),
        h.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        (l += "&client_id=" + encodeURIComponent(o.clientId)),
        (l += "&redirect_uri=" + e.redirectUri),
        e.pkceCodeVerifier && (l += "&code_verifier=" + e.pkceCodeVerifier),
        (h.withCredentials = !0),
        (h.onreadystatechange = function () {
          if (4 == h.readyState)
            if (200 == h.status) {
              var e = JSON.parse(h.responseText);
              f(
                e.access_token,
                e.refresh_token,
                e.id_token,
                "standard" === o.flow
              ),
                b();
            } else o.onAuthError && o.onAuthError(), t && t.setError();
        }),
        h.send(l);
    }
    function f(r, n, i, a) {
      m(r, n, i, (s = (s + new Date().getTime()) / 2)),
        c &&
        ((o.tokenParsed && o.tokenParsed.nonce != e.storedNonce) ||
          (o.refreshTokenParsed &&
            o.refreshTokenParsed.nonce != e.storedNonce) ||
          (o.idTokenParsed && o.idTokenParsed.nonce != e.storedNonce))
          ? (u("[KEYCLOAK] Invalid nonce, clearing token"),
            o.clearToken(),
            t && t.setError())
          : a && (o.onAuthSuccess && o.onAuthSuccess(), t && t.setSuccess());
    }
  }
  function p(e) {
    return 0 == e.status && e.responseText && e.responseURL.startsWith("file:");
  }
  function m(e, t, r, n) {
    if (
      (o.tokenTimeoutHandle &&
        (clearTimeout(o.tokenTimeoutHandle), (o.tokenTimeoutHandle = null)),
      t
        ? ((o.refreshToken = t), (o.refreshTokenParsed = k(t)))
        : (delete o.refreshToken, delete o.refreshTokenParsed),
      r
        ? ((o.idToken = r), (o.idTokenParsed = k(r)))
        : (delete o.idToken, delete o.idTokenParsed),
      e)
    ) {
      if (
        ((o.token = e),
        (o.tokenParsed = k(e)),
        (o.sessionId = o.tokenParsed.session_state),
        (o.authenticated = !0),
        (o.subject = o.tokenParsed.sub),
        (o.realmAccess = o.tokenParsed.realm_access),
        (o.resourceAccess = o.tokenParsed.resource_access),
        n && (o.timeSkew = Math.floor(n / 1e3) - o.tokenParsed.iat),
        null != o.timeSkew &&
          (u(
            "[KEYCLOAK] Estimated time difference between browser and server is " +
              o.timeSkew +
              " seconds"
          ),
          o.onTokenExpired))
      ) {
        var i =
          1e3 * (o.tokenParsed.exp - new Date().getTime() / 1e3 + o.timeSkew);
        u("[KEYCLOAK] Token expires in " + Math.round(i / 1e3) + " s"),
          i <= 0
            ? o.onTokenExpired()
            : (o.tokenTimeoutHandle = setTimeout(o.onTokenExpired, i));
      }
    } else
      delete o.token,
        delete o.tokenParsed,
        delete o.subject,
        delete o.realmAccess,
        delete o.resourceAccess,
        (o.authenticated = !1);
  }
  function k(e) {
    switch (
      (e = (e = (e = e.split(".")[1]).replace(/-/g, "+")).replace(/_/g, "/"))
        .length % 4
    ) {
      case 0:
        break;
      case 2:
        e += "==";
        break;
      case 3:
        e += "=";
        break;
      default:
        throw "Invalid token";
    }
    return (e = decodeURIComponent(escape(atob(e)))), JSON.parse(e);
  }
  function g() {
    var e = "0123456789abcdef",
      t = d(36, e).split("");
    return (
      (t[14] = "4"),
      (t[19] = e.substr((3 & t[19]) | 8, 1)),
      (t[8] = t[13] = t[18] = t[23] = "-"),
      t.join("")
    );
  }
  function y(e) {
    var t = (function (e) {
      var t;
      switch (o.flow) {
        case "standard":
          t = ["code", "state", "session_state", "kc_action_status"];
          break;
        case "implicit":
          t = [
            "access_token",
            "token_type",
            "id_token",
            "state",
            "session_state",
            "expires_in",
            "kc_action_status",
          ];
          break;
        case "hybrid":
          t = [
            "access_token",
            "token_type",
            "id_token",
            "code",
            "state",
            "session_state",
            "expires_in",
            "kc_action_status",
          ];
      }
      t.push("error"), t.push("error_description"), t.push("error_uri");
      var r,
        n,
        i = e.indexOf("?"),
        s = e.indexOf("#");
      if (
        ("query" === o.responseMode && -1 !== i
          ? ((r = e.substring(0, i)),
            "" !==
              (n = v(e.substring(i + 1, -1 !== s ? s : e.length), t))
                .paramsString && (r += "?" + n.paramsString),
            -1 !== s && (r += e.substring(s)))
          : "fragment" === o.responseMode &&
            -1 !== s &&
            ((r = e.substring(0, s)),
            "" !== (n = v(e.substring(s + 1), t)).paramsString &&
              (r += "#" + n.paramsString)),
        n && n.oauthParams)
      )
        if ("standard" === o.flow || "hybrid" === o.flow) {
          if (
            (n.oauthParams.code || n.oauthParams.error) &&
            n.oauthParams.state
          )
            return (n.oauthParams.newUrl = r), n.oauthParams;
        } else if (
          "implicit" === o.flow &&
          (n.oauthParams.access_token || n.oauthParams.error) &&
          n.oauthParams.state
        )
          return (n.oauthParams.newUrl = r), n.oauthParams;
    })(e);
    if (t) {
      var n = r.get(t.state);
      return (
        n &&
          ((t.valid = !0),
          (t.redirectUri = n.redirectUri),
          (t.storedNonce = n.nonce),
          (t.prompt = n.prompt),
          (t.pkceCodeVerifier = n.pkceCodeVerifier)),
        t
      );
    }
  }
  function v(e, t) {
    for (
      var r = e.split("&"), o = { paramsString: "", oauthParams: {} }, n = 0;
      n < r.length;
      n++
    ) {
      var i = r[n].indexOf("="),
        s = r[n].slice(0, i);
      -1 !== t.indexOf(s)
        ? (o.oauthParams[s] = r[n].slice(i + 1))
        : ("" !== o.paramsString && (o.paramsString += "&"),
          (o.paramsString += r[n]));
    }
    return o;
  }
  function S() {
    var e = {
      setSuccess: function (t) {
        e.resolve(t);
      },
      setError: function (t) {
        e.reject(t);
      },
    };
    return (
      (e.promise = new Promise(function (t, r) {
        (e.resolve = t), (e.reject = r);
      })),
      (e.promise.success = function (e) {
        return (
          logPromiseDeprecation(),
          this.then(function (t) {
            e(t);
          }),
          this
        );
      }),
      (e.promise.error = function (e) {
        return (
          logPromiseDeprecation(),
          this.catch(function (t) {
            e(t);
          }),
          this
        );
      }),
      e
    );
  }
  function w() {
    var e = S();
    if (!i.enable) return e.setSuccess(), e.promise;
    if (i.iframe) return e.setSuccess(), e.promise;
    var t = document.createElement("iframe");
    (i.iframe = t),
      (t.onload = function () {
        var t = o.endpoints.authorize();
        (i.iframeOrigin =
          "/" === t.charAt(0)
            ? window.location.origin
              ? window.location.origin
              : window.location.protocol +
                "//" +
                window.location.hostname +
                (window.location.port ? ":" + window.location.port : "")
            : t.substring(0, t.indexOf("/", 8))),
          e.setSuccess();
      });
    var r = o.endpoints.checkSessionIframe();
    return (
      t.setAttribute("src", r),
      t.setAttribute("title", "keycloak-session-iframe"),
      (t.style.display = "none"),
      document.body.appendChild(t),
      window.addEventListener(
        "message",
        function (e) {
          if (
            e.origin === i.iframeOrigin &&
            i.iframe.contentWindow === e.source &&
            ("unchanged" == e.data || "changed" == e.data || "error" == e.data)
          ) {
            "unchanged" != e.data && o.clearToken();
            for (
              var t = i.callbackList.splice(0, i.callbackList.length),
                r = t.length - 1;
              r >= 0;
              --r
            ) {
              var n = t[r];
              "error" == e.data
                ? n.setError()
                : n.setSuccess("unchanged" == e.data);
            }
          }
        },
        !1
      ),
      e.promise
    );
  }
  function b() {
    i.enable &&
      o.token &&
      setTimeout(function () {
        A().then(function (e) {
          e && b();
        });
      }, 1e3 * i.interval);
  }
  function A() {
    var e = S();
    if (i.iframe && i.iframeOrigin) {
      var t = o.clientId + " " + (o.sessionId ? o.sessionId : "");
      i.callbackList.push(e),
        1 == i.callbackList.length &&
          i.iframe.contentWindow.postMessage(t, i.iframeOrigin);
    } else e.setSuccess();
    return e.promise;
  }
  function _() {
    var e = S();
    if (i.enable || o.silentCheckSsoRedirectUri) {
      var t = document.createElement("iframe");
      t.setAttribute("src", o.endpoints.thirdPartyCookiesIframe()),
        t.setAttribute("title", "keycloak-3p-check-iframe"),
        (t.style.display = "none"),
        document.body.appendChild(t);
      var r = function (n) {
        t.contentWindow === n.source &&
          (("supported" !== n.data && "unsupported" !== n.data) ||
            ("unsupported" === n.data &&
              ((i.enable = !1),
              o.silentCheckSsoFallback && (o.silentCheckSsoRedirectUri = !1),
              l(
                "[KEYCLOAK] 3rd party cookies aren't supported by this browser. checkLoginIframe and silent check-sso are not available."
              )),
            document.body.removeChild(t),
            window.removeEventListener("message", r),
            e.setSuccess()));
      };
      window.addEventListener("message", r, !1);
    } else e.setSuccess();
    return (function (e, t, r) {
      var o = null,
        n = new Promise(function (e, r) {
          o = setTimeout(function () {
            r({
              error: "Timeout when waiting for 3rd party check iframe message.",
            });
          }, t);
        });
      return Promise.race([e, n]).finally(function () {
        clearTimeout(o);
      });
    })(e.promise, o.messageReceiveTimeout);
  }
  function R(e) {
    if (!e || "default" == e)
      return {
        login: function (e) {
          return window.location.replace(o.createLoginUrl(e)), S().promise;
        },
        logout: function (e) {
          return window.location.replace(o.createLogoutUrl(e)), S().promise;
        },
        register: function (e) {
          return window.location.replace(o.createRegisterUrl(e)), S().promise;
        },
        accountManagement: function () {
          var e = o.createAccountUrl();
          if (void 0 === e) throw "Not supported by the OIDC server";
          return (window.location.href = e), S().promise;
        },
        redirectUri: function (e, t) {
          return e && e.redirectUri
            ? e.redirectUri
            : o.redirectUri
            ? o.redirectUri
            : location.href;
        },
      };
    if ("cordova" == e) {
      i.enable = !1;
      var t = function (e, t, r) {
          return window.cordova && window.cordova.InAppBrowser
            ? window.cordova.InAppBrowser.open(e, t, r)
            : window.open(e, t, r);
        },
        r = function (e) {
          var t = (function (e) {
            return e && e.cordovaOptions
              ? Object.keys(e.cordovaOptions).reduce(function (t, r) {
                  return (t[r] = e.cordovaOptions[r]), t;
                }, {})
              : {};
          })(e);
          return (
            (t.location = "no"),
            e && "none" == e.prompt && (t.hidden = "yes"),
            (function (e) {
              return Object.keys(e)
                .reduce(function (t, r) {
                  return t.push(r + "=" + e[r]), t;
                }, [])
                .join(",");
            })(t)
          );
        };
      return {
        login: function (e) {
          var n = S(),
            i = r(e),
            s = o.createLoginUrl(e),
            a = t(s, "_blank", i),
            c = !1,
            u = !1,
            l = function () {
              (u = !0), a.close();
            };
          return (
            a.addEventListener("loadstart", function (e) {
              0 == e.url.indexOf("http://localhost") &&
                (f(y(e.url), n), l(), (c = !0));
            }),
            a.addEventListener("loaderror", function (e) {
              c ||
                (0 == e.url.indexOf("http://localhost")
                  ? (f(y(e.url), n), l(), (c = !0))
                  : (n.setError(), l()));
            }),
            a.addEventListener("exit", function (e) {
              u || n.setError({ reason: "closed_by_user" });
            }),
            n.promise
          );
        },
        logout: function (e) {
          var r,
            n = S(),
            i = o.createLogoutUrl(e),
            s = t(i, "_blank", "location=no,hidden=yes,clearcache=yes");
          return (
            s.addEventListener("loadstart", function (e) {
              0 == e.url.indexOf("http://localhost") && s.close();
            }),
            s.addEventListener("loaderror", function (e) {
              0 == e.url.indexOf("http://localhost") || (r = !0), s.close();
            }),
            s.addEventListener("exit", function (e) {
              r ? n.setError() : (o.clearToken(), n.setSuccess());
            }),
            n.promise
          );
        },
        register: function (e) {
          var n = S(),
            i = o.createRegisterUrl(),
            s = r(e),
            a = t(i, "_blank", s);
          return (
            a.addEventListener("loadstart", function (e) {
              0 == e.url.indexOf("http://localhost") &&
                (a.close(), f(y(e.url), n));
            }),
            n.promise
          );
        },
        accountManagement: function () {
          var e = o.createAccountUrl();
          if (void 0 === e) throw "Not supported by the OIDC server";
          var r = t(e, "_blank", "location=no");
          r.addEventListener("loadstart", function (e) {
            0 == e.url.indexOf("http://localhost") && r.close();
          });
        },
        redirectUri: function (e) {
          return "http://localhost";
        },
      };
    }
    if ("cordova-native" == e)
      return (
        (i.enable = !1),
        {
          login: function (e) {
            var t = S(),
              r = o.createLoginUrl(e);
            return (
              universalLinks.subscribe("keycloak", function (e) {
                universalLinks.unsubscribe("keycloak"),
                  window.cordova.plugins.browsertab.close(),
                  f(y(e.url), t);
              }),
              window.cordova.plugins.browsertab.openUrl(r),
              t.promise
            );
          },
          logout: function (e) {
            var t = S(),
              r = o.createLogoutUrl(e);
            return (
              universalLinks.subscribe("keycloak", function (e) {
                universalLinks.unsubscribe("keycloak"),
                  window.cordova.plugins.browsertab.close(),
                  o.clearToken(),
                  t.setSuccess();
              }),
              window.cordova.plugins.browsertab.openUrl(r),
              t.promise
            );
          },
          register: function (e) {
            var t = S(),
              r = o.createRegisterUrl(e);
            return (
              universalLinks.subscribe("keycloak", function (e) {
                universalLinks.unsubscribe("keycloak"),
                  window.cordova.plugins.browsertab.close(),
                  f(y(e.url), t);
              }),
              window.cordova.plugins.browsertab.openUrl(r),
              t.promise
            );
          },
          accountManagement: function () {
            var e = o.createAccountUrl();
            if (void 0 === e) throw "Not supported by the OIDC server";
            window.cordova.plugins.browsertab.openUrl(e);
          },
          redirectUri: function (e) {
            return e && e.redirectUri
              ? e.redirectUri
              : o.redirectUri
              ? o.redirectUri
              : "http://localhost";
          },
        }
      );
    throw "invalid adapter type: " + e;
  }
  (o.init = function (n) {
    if (
      ((o.authenticated = !1),
      (r = (function () {
        try {
          return new E();
        } catch (e) {}
        return new C();
      })()),
      (t =
        n && ["default", "cordova", "cordova-native"].indexOf(n.adapter) > -1
          ? R(n.adapter)
          : n && "object" == typeof n.adapter
          ? n.adapter
          : window.Cordova || window.cordova
          ? R("cordova")
          : R()),
      n)
    ) {
      if (
        (void 0 !== n.useNonce && (c = n.useNonce),
        void 0 !== n.checkLoginIframe && (i.enable = n.checkLoginIframe),
        n.checkLoginIframeInterval && (i.interval = n.checkLoginIframeInterval),
        "login-required" === n.onLoad && (o.loginRequired = !0),
        n.responseMode)
      ) {
        if ("query" !== n.responseMode && "fragment" !== n.responseMode)
          throw "Invalid value for responseMode";
        o.responseMode = n.responseMode;
      }
      if (n.flow) {
        switch (n.flow) {
          case "standard":
            o.responseType = "code";
            break;
          case "implicit":
            o.responseType = "id_token token";
            break;
          case "hybrid":
            o.responseType = "code id_token token";
            break;
          default:
            throw "Invalid value for flow";
        }
        o.flow = n.flow;
      }
      if (
        (null != n.timeSkew && (o.timeSkew = n.timeSkew),
        n.redirectUri && (o.redirectUri = n.redirectUri),
        n.silentCheckSsoRedirectUri &&
          (o.silentCheckSsoRedirectUri = n.silentCheckSsoRedirectUri),
        (o.silentCheckSsoFallback =
          "boolean" != typeof n.silentCheckSsoFallback ||
          n.silentCheckSsoFallback),
        n.pkceMethod)
      ) {
        if ("S256" !== n.pkceMethod) throw "Invalid value for pkceMethod";
        o.pkceMethod = n.pkceMethod;
      }
      (o.enableLogging =
        "boolean" == typeof n.enableLogging && n.enableLogging),
        "string" == typeof n.scope && (o.scope = n.scope),
        (o.messageReceiveTimeout =
          "number" == typeof n.messageReceiveTimeout &&
          n.messageReceiveTimeout > 0
            ? n.messageReceiveTimeout
            : 1e4);
    }
    o.responseMode || (o.responseMode = "fragment"),
      o.responseType || ((o.responseType = "code"), (o.flow = "standard"));
    var s = S(),
      a = S();
    a.promise
      .then(function () {
        o.onReady && o.onReady(o.authenticated), s.setSuccess(o.authenticated);
      })
      .catch(function (e) {
        s.setError(e);
      });
    var u = (function (t) {
      var r,
        n = S();
      function i(e) {
        o.endpoints = e
          ? {
              authorize: function () {
                return e.authorization_endpoint;
              },
              token: function () {
                return e.token_endpoint;
              },
              logout: function () {
                if (!e.end_session_endpoint)
                  throw "Not supported by the OIDC server";
                return e.end_session_endpoint;
              },
              checkSessionIframe: function () {
                if (!e.check_session_iframe)
                  throw "Not supported by the OIDC server";
                return e.check_session_iframe;
              },
              register: function () {
                throw 'Redirection to "Register user" page not supported in standard OIDC mode';
              },
              userinfo: function () {
                if (!e.userinfo_endpoint)
                  throw "Not supported by the OIDC server";
                return e.userinfo_endpoint;
              },
            }
          : {
              authorize: function () {
                return h() + "/protocol/openid-connect/auth";
              },
              token: function () {
                return h() + "/protocol/openid-connect/token";
              },
              logout: function () {
                return h() + "/protocol/openid-connect/logout";
              },
              checkSessionIframe: function () {
                var e =
                  h() + "/protocol/openid-connect/login-status-iframe.html";
                return (
                  o.iframeVersion && (e = e + "?version=" + o.iframeVersion), e
                );
              },
              thirdPartyCookiesIframe: function () {
                var e = h() + "/protocol/openid-connect/3p-cookies/step1.html";
                return (
                  o.iframeVersion && (e = e + "?version=" + o.iframeVersion), e
                );
              },
              register: function () {
                return h() + "/protocol/openid-connect/registrations";
              },
              userinfo: function () {
                return h() + "/protocol/openid-connect/userinfo";
              },
            };
      }
      if ((e ? "string" == typeof e && (r = e) : (r = "keycloak.json"), r))
        (c = new XMLHttpRequest()).open("GET", r, !0),
          c.setRequestHeader("Accept", "application/json"),
          (c.onreadystatechange = function () {
            if (4 == c.readyState)
              if (200 == c.status || p(c)) {
                var e = JSON.parse(c.responseText);
                (o.authServerUrl = e["auth-server-url"]),
                  (o.realm = e.realm),
                  (o.clientId = e.resource),
                  i(null),
                  n.setSuccess();
              } else n.setError();
          }),
          c.send();
      else {
        if (!e.clientId) throw "clientId missing";
        o.clientId = e.clientId;
        var s = e.oidcProvider;
        if (s) {
          var a, c;
          "string" == typeof s
            ? ((a =
                "/" == s.charAt(s.length - 1)
                  ? s + ".well-known/openid-configuration"
                  : s + "/.well-known/openid-configuration"),
              (c = new XMLHttpRequest()).open("GET", a, !0),
              c.setRequestHeader("Accept", "application/json"),
              (c.onreadystatechange = function () {
                4 == c.readyState &&
                  (200 == c.status || p(c)
                    ? (i(JSON.parse(c.responseText)), n.setSuccess())
                    : n.setError());
              }),
              c.send())
            : (i(s), n.setSuccess());
        } else {
          if (!e.url)
            for (
              var u = document.getElementsByTagName("script"), l = 0;
              l < u.length;
              l++
            )
              if (u[l].src.match(/.*keycloak\.js/)) {
                e.url = u[l].src.substr(0, u[l].src.indexOf("/js/keycloak.js"));
                break;
              }
          if (!e.realm) throw "realm missing";
          (o.authServerUrl = e.url),
            (o.realm = e.realm),
            i(null),
            n.setSuccess();
        }
      }
      return n.promise;
    })();
    function l() {
      var e = function (e) {
          e || (r.prompt = "none"),
            o
              .login(r)
              .then(function () {
                a.setSuccess();
              })
              .catch(function (e) {
                a.setError(e);
              });
        },
        t = function () {
          var e = document.createElement("iframe"),
            t = o.createLoginUrl({
              prompt: "none",
              redirectUri: o.silentCheckSsoRedirectUri,
            });
          e.setAttribute("src", t),
            e.setAttribute("title", "keycloak-silent-check-sso"),
            (e.style.display = "none"),
            document.body.appendChild(e);
          var r = function (t) {
            t.origin === window.location.origin &&
              e.contentWindow === t.source &&
              (f(y(t.data), a),
              document.body.removeChild(e),
              window.removeEventListener("message", r));
          };
          window.addEventListener("message", r);
        },
        r = {};
      switch (n.onLoad) {
        case "check-sso":
          i.enable
            ? w().then(function () {
                A()
                  .then(function (r) {
                    r
                      ? a.setSuccess()
                      : o.silentCheckSsoRedirectUri
                      ? t()
                      : e(!1);
                  })
                  .catch(function (e) {
                    a.setError(e);
                  });
              })
            : o.silentCheckSsoRedirectUri
            ? t()
            : e(!1);
          break;
        case "login-required":
          e(!0);
          break;
        default:
          throw "Invalid value for onLoad";
      }
    }
    function d() {
      var e = y(window.location.href);
      if (
        (e && window.history.replaceState(window.history.state, null, e.newUrl),
        e && e.valid)
      )
        return w()
          .then(function () {
            f(e, a);
          })
          .catch(function (e) {
            a.setError(e);
          });
      n
        ? n.token && n.refreshToken
          ? (m(n.token, n.refreshToken, n.idToken),
            i.enable
              ? w().then(function () {
                  A()
                    .then(function (e) {
                      e
                        ? (o.onAuthSuccess && o.onAuthSuccess(),
                          a.setSuccess(),
                          b())
                        : a.setSuccess();
                    })
                    .catch(function (e) {
                      a.setError(e);
                    });
                })
              : o
                  .updateToken(-1)
                  .then(function () {
                    o.onAuthSuccess && o.onAuthSuccess(), a.setSuccess();
                  })
                  .catch(function (e) {
                    o.onAuthError && o.onAuthError(),
                      n.onLoad ? l() : a.setError(e);
                  }))
          : n.onLoad
          ? l()
          : a.setSuccess()
        : a.setSuccess();
    }
    return (
      u.then(function () {
        (function () {
          var e = S(),
            t = function () {
              ("interactive" !== document.readyState &&
                "complete" !== document.readyState) ||
                (document.removeEventListener("readystatechange", t),
                e.setSuccess());
            };
          return (
            document.addEventListener("readystatechange", t), t(), e.promise
          );
        })()
          .then(_)
          .then(d)
          .catch(function (e) {
            s.setError(e);
          });
      }),
      u.catch(function (e) {
        s.setError(e);
      }),
      s.promise
    );
  }),
    (o.login = function (e) {
      return t.login(e);
    }),
    (o.createLoginUrl = function (e) {
      var n,
        i = g(),
        s = g(),
        a = t.redirectUri(e),
        u = { state: i, nonce: s, redirectUri: encodeURIComponent(a) };
      e && e.prompt && (u.prompt = e.prompt),
        (n =
          e && "register" == e.action
            ? o.endpoints.register()
            : o.endpoints.authorize());
      var l = (e && e.scope) || o.scope;
      l ? -1 === l.indexOf("openid") && (l = "openid " + l) : (l = "openid");
      var h =
        n +
        "?client_id=" +
        encodeURIComponent(o.clientId) +
        "&redirect_uri=" +
        encodeURIComponent(a) +
        "&state=" +
        encodeURIComponent(i) +
        "&response_mode=" +
        encodeURIComponent(o.responseMode) +
        "&response_type=" +
        encodeURIComponent(o.responseType) +
        "&scope=" +
        encodeURIComponent(l);
      if (
        (c && (h = h + "&nonce=" + encodeURIComponent(s)),
        e && e.prompt && (h += "&prompt=" + encodeURIComponent(e.prompt)),
        e && e.maxAge && (h += "&max_age=" + encodeURIComponent(e.maxAge)),
        e &&
          e.loginHint &&
          (h += "&login_hint=" + encodeURIComponent(e.loginHint)),
        e &&
          e.idpHint &&
          (h += "&kc_idp_hint=" + encodeURIComponent(e.idpHint)),
        e &&
          e.action &&
          "register" != e.action &&
          (h += "&kc_action=" + encodeURIComponent(e.action)),
        e && e.locale && (h += "&ui_locales=" + encodeURIComponent(e.locale)),
        e && e.acr)
      ) {
        var f = JSON.stringify({ id_token: { acr: e.acr } });
        h += "&claims=" + encodeURIComponent(f);
      }
      if (o.pkceMethod) {
        var p = d(
          96,
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        );
        u.pkceCodeVerifier = p;
        var m = (function (e, t) {
          if ("S256" === e) {
            var r = new Uint8Array(sha256.arrayBuffer(t));
            return base64Js
              .fromByteArray(r)
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/\=/g, "");
          }
          throw "Invalid value for pkceMethod";
        })(o.pkceMethod, p);
        (h += "&code_challenge=" + m),
          (h += "&code_challenge_method=" + o.pkceMethod);
      }
      return r.add(u), h;
    }),
    (o.logout = function (e) {
      return t.logout(e);
    }),
    (o.createLogoutUrl = function (e) {
      return (
        o.endpoints.logout() +
        "?post_logout_redirect_uri=" + encodeURIComponent(t.redirectUri(e, !1)) +
        "&id_token_hint=" + encodeURIComponent(o.idToken)
      );
    }),
    (o.register = function (e) {
      return t.register(e);
    }),
    (o.createRegisterUrl = function (e) {
      return e || (e = {}), (e.action = "register"), o.createLoginUrl(e);
    }),
    (o.createAccountUrl = function (e) {
      var r = h(),
        n = void 0;
      return (
        void 0 !== r &&
          (n =
            r +
            "/account?referrer=" +
            encodeURIComponent(o.clientId) +
            "&referrer_uri=" +
            encodeURIComponent(t.redirectUri(e))),
        n
      );
    }),
    (o.accountManagement = function () {
      return t.accountManagement();
    }),
    (o.hasRealmRole = function (e) {
      var t = o.realmAccess;
      return !!t && t.roles.indexOf(e) >= 0;
    }),
    (o.hasResourceRole = function (e, t) {
      if (!o.resourceAccess) return !1;
      var r = o.resourceAccess[t || o.clientId];
      return !!r && r.roles.indexOf(e) >= 0;
    }),
    (o.loadUserProfile = function () {
      var e = h() + "/account",
        t = new XMLHttpRequest();
      t.open("GET", e, !0),
        t.setRequestHeader("Accept", "application/json"),
        t.setRequestHeader("Authorization", "bearer " + o.token);
      var r = S();
      return (
        (t.onreadystatechange = function () {
          4 == t.readyState &&
            (200 == t.status
              ? ((o.profile = JSON.parse(t.responseText)),
                r.setSuccess(o.profile))
              : r.setError());
        }),
        t.send(),
        r.promise
      );
    }),
    (o.loadUserInfo = function () {
      var e = o.endpoints.userinfo(),
        t = new XMLHttpRequest();
      t.open("GET", e, !0),
        t.setRequestHeader("Accept", "application/json"),
        t.setRequestHeader("Authorization", "bearer " + o.token);
      var r = S();
      return (
        (t.onreadystatechange = function () {
          4 == t.readyState &&
            (200 == t.status
              ? ((o.userInfo = JSON.parse(t.responseText)),
                r.setSuccess(o.userInfo))
              : r.setError());
        }),
        t.send(),
        r.promise
      );
    }),
    (o.isTokenExpired = function (e) {
      if (!o.tokenParsed || (!o.refreshToken && "implicit" != o.flow))
        throw "Not authenticated";
      if (null == o.timeSkew)
        return (
          u(
            "[KEYCLOAK] Unable to determine if token is expired as timeskew is not set"
          ),
          !0
        );
      var t =
        o.tokenParsed.exp - Math.ceil(new Date().getTime() / 1e3) + o.timeSkew;
      if (e) {
        if (isNaN(e)) throw "Invalid minValidity";
        t -= e;
      }
      return t < 0;
    }),
    (o.updateToken = function (e) {
      var t = S();
      if (!o.refreshToken) return t.setError(), t.promise;
      e = e || 5;
      var r = function () {
        var r = !1;
        if (
          (-1 == e
            ? ((r = !0), u("[KEYCLOAK] Refreshing token: forced refresh"))
            : (o.tokenParsed && !o.isTokenExpired(e)) ||
              ((r = !0), u("[KEYCLOAK] Refreshing token: token expired")),
          r)
        ) {
          var i = "grant_type=refresh_token&refresh_token=" + o.refreshToken,
            s = o.endpoints.token();
          if ((n.push(t), 1 == n.length)) {
            var a = new XMLHttpRequest();
            a.open("POST", s, !0),
              a.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
              ),
              (a.withCredentials = !0),
              (i += "&client_id=" + encodeURIComponent(o.clientId));
            var c = new Date().getTime();
            (a.onreadystatechange = function () {
              if (4 == a.readyState)
                if (200 == a.status) {
                  u("[KEYCLOAK] Token refreshed"),
                    (c = (c + new Date().getTime()) / 2);
                  var e = JSON.parse(a.responseText);
                  m(e.access_token, e.refresh_token, e.id_token, c),
                    o.onAuthRefreshSuccess && o.onAuthRefreshSuccess();
                  for (var t = n.pop(); null != t; t = n.pop())
                    t.setSuccess(!0);
                } else
                  for (
                    l("[KEYCLOAK] Failed to refresh token"),
                      400 == a.status && o.clearToken(),
                      o.onAuthRefreshError && o.onAuthRefreshError(),
                      t = n.pop();
                    null != t;
                    t = n.pop()
                  )
                    t.setError(!0);
            }),
              a.send(i);
          }
        } else t.setSuccess(!1);
      };
      return (
        i.enable
          ? A()
              .then(function () {
                r();
              })
              .catch(function (e) {
                t.setError(e);
              })
          : r(),
        t.promise
      );
    }),
    (o.clearToken = function () {
      o.token &&
        (m(null, null, null),
        o.onAuthLogout && o.onAuthLogout(),
        o.loginRequired && o.login());
    });
  var E = function () {
      if (!(this instanceof E)) return new E();
      function e() {
        for (
          var e = new Date().getTime(), t = 0;
          t < localStorage.length;
          t++
        ) {
          var r = localStorage.key(t);
          if (r && 0 == r.indexOf("kc-callback-")) {
            var o = localStorage.getItem(r);
            if (o)
              try {
                var n = JSON.parse(o).expires;
                (!n || n < e) && localStorage.removeItem(r);
              } catch (e) {
                localStorage.removeItem(r);
              }
          }
        }
      }
      localStorage.setItem("kc-test", "test"),
        localStorage.removeItem("kc-test"),
        (this.get = function (t) {
          if (t) {
            var r = "kc-callback-" + t,
              o = localStorage.getItem(r);
            return (
              o && (localStorage.removeItem(r), (o = JSON.parse(o))), e(), o
            );
          }
        }),
        (this.add = function (t) {
          e();
          var r = "kc-callback-" + t.state;
          (t.expires = new Date().getTime() + 36e5),
            localStorage.setItem(r, JSON.stringify(t));
        });
    },
    C = function () {
      if (!(this instanceof C)) return new C();
      var e = this;
      (e.get = function (e) {
        if (e) {
          var n = r("kc-callback-" + e);
          return o("kc-callback-" + e, "", t(-100)), n ? JSON.parse(n) : void 0;
        }
      }),
        (e.add = function (e) {
          o("kc-callback-" + e.state, JSON.stringify(e), t(60));
        }),
        (e.removeItem = function (e) {
          o(e, "", t(-100));
        });
      var t = function (e) {
          var t = new Date();
          return t.setTime(t.getTime() + 60 * e * 1e3), t;
        },
        r = function (e) {
          for (
            var t = e + "=", r = document.cookie.split(";"), o = 0;
            o < r.length;
            o++
          ) {
            for (var n = r[o]; " " == n.charAt(0); ) n = n.substring(1);
            if (0 == n.indexOf(t)) return n.substring(t.length, n.length);
          }
          return "";
        },
        o = function (e, t, r) {
          var o = e + "=" + t + "; expires=" + r.toUTCString() + "; ";
          document.cookie = o;
        };
    };
  function H(e) {
    return function () {
      o.enableLogging &&
        e.apply(console, Array.prototype.slice.call(arguments));
    };
  }

  o.winkLoadUserProfile = function (obj) {
    o.loadUserProfile()
      .then(function (profile) {
        o.renderUserData(profile);
        refreshButtonInterval = setInterval(o.updateRefreshTokenButton, 1000);
        obj.getUserProfile(profile);
      })
      .catch(function (error) {
        obj.onFailure("error while winkLoadUserProfile");
        console.log(error);
      });
  };

  o.initWinkClient = function (obj) {
    o.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      enableCors: true
    })
      .then(function (authenticated) {
        if (!authenticated) {
          obj.onFailure("user is not authenticated..!");
        } else {
          o.winkLoadUserProfile(obj);
        }
      })
      .catch(function () {
        obj.onFailure("error while initWinkClient");
      });
  };

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  function openTab(evt, tokenName) {

    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tokenName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  o.winkLogin = function (obj) {
    o.init({
      onLoad: "login-required",
      enableCors: true
    })
      .then(function (authenticated) {
        o.renderUserData(authenticated);
      })
      .catch(function () {
        alert("failed to initialize");
      });
  };

  o.updateRefreshTokenButton = function () {
    const curTime = new Date();
    const expTime = new Date(winkLogin.tokenParsed.exp * 1000);
    if (expTime < curTime) {
      $("#wink-oauth-refresh-button").css("background", "blue");
      clearInterval(refreshButtonInterval);
    }
  }

  o.renderUserData = function (profile) {
    console.log("renderUserData");
    let userDataElement = document.getElementById("wink-user-data");
    if (userDataElement) {
        userDataElement.innerHTML = "";
        userDataElement.innerHTML = `

        `;
        o.renderButtons();
        o.renderTokens(profile);
    } else {
        console.log('no element with ID #wink-user-data found')
    }
  }

  o.renderButtons = function() {
    console.log("renderButtons");
    let buttonsElement = document.getElementById("wink-buttons");
    if (buttonsElement) {
        buttonsElement.innerHTML = "";
        buttonsElement.innerHTML = `

	   <button id="wink-oauth-refresh-button" class="wink-oauth-button" onclick="refreshToken();">Refresh token</button>
	   <button id="wink-oauth-logout-button" class="wink-oauth-button" onclick="signOut();">Sign out</button>
          `;
    } else {
        console.log('no element with ID #wink-buttons found')
    }
  }


  o.renderTokens = function(profile) {
    console.log("renderTokens");
    let tokensElement = document.getElementById("wink-tokens");
    if (tokensElement) {
        tokensElement.innerHTML = "";
        tokensElement.innerHTML = `

	   <div class="tab">
           <button class="tablinks" onclick="openTab(event, 'I')" id="defaultOpen">Profile information</button>
           <button class="tablinks" onclick="openTab(event, 'ACT')">Access token</button>
           <button class="tablinks" onclick="openTab(event, 'RET')">Refresh token</button>
           <button class="tablinks" onclick="openTab(event, 'IDT')">ID token</button>
        </div>

        <div id="I" class="tabcontent">
          <div class="row">
            <div class="column" style="max-width: 255px">
               <p><b>Username (winkTag)</b></p>
               <p><b>Name (firstName)</b></p>
        		 <p><b>Surname (lastName)</b></p>
               <p><b>Phone (contactNo)</b></p>
               <p><b>Email (email)</b></p>
               <p><b>ID (identityId)</b></p>
               <p><b>WinkToken</b></p>
            </div>
            <div class="column">
               <p>${profile.username}</p>
               <p>${o.idTokenParsed.given_name}</p>
               <p>${o.idTokenParsed.family_name}</p>
               <p>${o.idTokenParsed.phone_number}</p>
               <p>${o.idTokenParsed.email}</p>
               <p>${o.idTokenParsed.oid}</p>
               <p>${o.idTokenParsed.sub}</p>
             </div>
          </div>

        </div>


<div id="ACT" class="tabcontent">
  <p><b>Expiration date: </b>${o.getFormattedTime(o.tokenParsed.exp)}</p>
  <p><textarea id="aT" cols="100" rows="3">${o.token}</textarea></p>
  <p><textarea id="aTP" cols="100" rows="12">${JSON.stringify(parseJwt(o.token), null, 4)}</textarea></p>
</div>

<div id="RET" class="tabcontent">
  <p><b>Expiration date: </b>${o.getFormattedTime(o.refreshTokenParsed.exp)}</p>
  <p><textarea id="rT" cols="100" rows="3">${o.refreshToken}</textarea></p>
  <p><textarea id="rTP" cols="100" rows="12">${JSON.stringify(o.refreshTokenParsed, null, 4)}</textarea></p>
</div>

<div id="IDT" class="tabcontent">
  <p><b>Expiration date: </b>${o.getFormattedTime(o.idTokenParsed.exp)}</p>
  <p><textarea id="iT" cols="100" rows="3">${o.idToken}</textarea></p>
  <p><textarea id="iTP" cols="100" rows="12">${JSON.stringify(o.idTokenParsed, null, 4)}</textarea></p>
</div>
        `;
    document.getElementById("defaultOpen").click()

    } else {
        console.log('no element with ID #wink-tokens found')
    }
  }

  o.getFormattedTime = function(timestamp) {
     var date = new Date(timestamp * 1000);
     return date.toLocaleString();
  }
}

console.log("wapi:loaded");

var addStyles = function (e) {
  var t = document.createElement("style");
  (t.innerText = e), document.head.appendChild(t);
};
(window.onload = function () {
  addStyles(css_248z);
}),
  (window.WinkLogin = Keycloak);
//# sourceMappingURL=winklogin.module.js.map

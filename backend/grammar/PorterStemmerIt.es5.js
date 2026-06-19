/*!
 * Snowball JavaScript Library v0.6
 * http://snowball.tartarus.org/
 * https://github.com/mazko/jssnowball
 *
 * Copyright 01.02.2016 11:59:30, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 */
'use strict';

(function (global) { // versione ES5 per browser tradizionale
  
class StringBuffer {
    get b() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$b') ? this._$esjava$b : this._$esjava$b = "";
    }
    set b(v) {
        this._$esjava$b = v;
    }
    length$esjava$0() {
        return this.b.length;
    }
    replace$esjava$3(start, end, str) {
        if (start === 0 && end === this.b.length) {
            this.b = str;
        } else {
            let left = this.b.substring(0, start), right = this.b.substring(end);
            this.b = left + str + right;
        }
    }
    substring$esjava$2(start, end) {
        return this.b.substring(start, end);
    }
    charAt$esjava$1(index) {
        return this.b.charCodeAt(index);
    }
    subSequence$esjava$2(start, end) {
        throw new Error("NotImpl: CharSequence::subSequence");
    }
    toString$esjava$0() {
        return this.b;
    }
    length(...args) {
        switch (args.length) {
        case 0:
            return this.length$esjava$0(...args);
        }
        return super.length(...args);
    }
    replace(...args) {
        switch (args.length) {
        case 3:
            return this.replace$esjava$3(...args);
        }
        return super.replace(...args);
    }
    substring(...args) {
        switch (args.length) {
        case 2:
            return this.substring$esjava$2(...args);
        }
        return super.substring(...args);
    }
    charAt(...args) {
        switch (args.length) {
        case 1:
            return this.charAt$esjava$1(...args);
        }
        return super.charAt(...args);
    }
    subSequence(...args) {
        switch (args.length) {
        case 2:
            return this.subSequence$esjava$2(...args);
        }
        return super.subSequence(...args);
    }
    toString(...args) {
        switch (args.length) {
        case 0:
            return this.toString$esjava$0(...args);
        }
        return super.toString(...args);
    }
}
class StringBuilder extends StringBuffer {
}
class Among {
    static toCharArray$esjava$1(s) {
        let sLength = s.length;
        let charArr = new Array(sLength);
        for (let i = 0; i < sLength; i++)
            charArr[i] = s.charCodeAt(i);
        return charArr;
    }
    constructor(s, substring_i, result, methodname, obj) {
        this.s = Among.toCharArray$esjava$1(s);
        this.substring_i = substring_i;
        this.result = result;
        this.method = methodname ? obj[methodname] : null;
        this.methodobject = obj;
    }
    get s() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$s') ? this._$esjava$s : this._$esjava$s = null;
    }
    set s(v) {
        this._$esjava$s = v;
    }
    get substring_i() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$substring_i') ? this._$esjava$substring_i : this._$esjava$substring_i = 0;
    }
    set substring_i(v) {
        this._$esjava$substring_i = v;
    }
    get result() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$result') ? this._$esjava$result : this._$esjava$result = 0;
    }
    set result(v) {
        this._$esjava$result = v;
    }
    get method() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$method') ? this._$esjava$method : this._$esjava$method = null;
    }
    set method(v) {
        this._$esjava$method = v;
    }
    get methodobject() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$methodobject') ? this._$esjava$methodobject : this._$esjava$methodobject = null;
    }
    set methodobject(v) {
        this._$esjava$methodobject = v;
    }
}
class SnowballProgram {
    constructor() {
        this.current = new StringBuffer();
        this.setCurrent$esjava$1("");
    }
    setCurrent$esjava$1(value) {
        this.current.replace(0, this.current.length(), value);
        this.cursor = 0;
        this.limit = this.current.length();
        this.limit_backward = 0;
        this.bra = this.cursor;
        this.ket = this.limit;
    }
    getCurrent$esjava$0() {
        let result = this.current.toString();
        this.current = new StringBuffer();
        return result;
    }
    get current() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$current') ? this._$esjava$current : this._$esjava$current = null;
    }
    set current(v) {
        this._$esjava$current = v;
    }
    get cursor() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$cursor') ? this._$esjava$cursor : this._$esjava$cursor = 0;
    }
    set cursor(v) {
        this._$esjava$cursor = v;
    }
    get limit() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$limit') ? this._$esjava$limit : this._$esjava$limit = 0;
    }
    set limit(v) {
        this._$esjava$limit = v;
    }
    get limit_backward() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$limit_backward') ? this._$esjava$limit_backward : this._$esjava$limit_backward = 0;
    }
    set limit_backward(v) {
        this._$esjava$limit_backward = v;
    }
    get bra() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$bra') ? this._$esjava$bra : this._$esjava$bra = 0;
    }
    set bra(v) {
        this._$esjava$bra = v;
    }
    get ket() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$ket') ? this._$esjava$ket : this._$esjava$ket = 0;
    }
    set ket(v) {
        this._$esjava$ket = v;
    }
    in_grouping$esjava$3(s, min, max) {
        if (this.cursor >= this.limit)
            return false;
        let ch = this.current.charAt(this.cursor);
        if (ch > max || ch < min)
            return false;
        ch -= min;
        if ((s[ch >> 3] & 0X1 << (ch & 0X7)) === 0)
            return false;
        this.cursor++;
        return true;
    }
    in_grouping_b$esjava$3(s, min, max) {
        if (this.cursor <= this.limit_backward)
            return false;
        let ch = this.current.charAt(this.cursor - 1);
        if (ch > max || ch < min)
            return false;
        ch -= min;
        if ((s[ch >> 3] & 0X1 << (ch & 0X7)) === 0)
            return false;
        this.cursor--;
        return true;
    }
    out_grouping$esjava$3(s, min, max) {
        if (this.cursor >= this.limit)
            return false;
        let ch = this.current.charAt(this.cursor);
        if (ch > max || ch < min) {
            this.cursor++;
            return true;
        }
        ch -= min;
        if ((s[ch >> 3] & 0X1 << (ch & 0X7)) === 0) {
            this.cursor++;
            return true;
        }
        return false;
    }
    out_grouping_b$esjava$3(s, min, max) {
        if (this.cursor <= this.limit_backward)
            return false;
        let ch = this.current.charAt(this.cursor - 1);
        if (ch > max || ch < min) {
            this.cursor--;
            return true;
        }
        ch -= min;
        if ((s[ch >> 3] & 0X1 << (ch & 0X7)) === 0) {
            this.cursor--;
            return true;
        }
        return false;
    }
    eq_s$esjava$1(s) {
        if (this.limit - this.cursor < s.length)
            return false;
        let i;
        for (i = 0; i !== s.length; i++) {
            if (this.current.charAt(this.cursor + i) !== s.charCodeAt(i))
                return false;
        }
        this.cursor += s.length;
        return true;
    }
    eq_s_b$esjava$1(s) {
        if (this.cursor - this.limit_backward < s.length)
            return false;
        let i;
        for (i = 0; i !== s.length; i++) {
            if (this.current.charAt(this.cursor - s.length + i) !== s.charCodeAt(i))
                return false;
        }
        this.cursor -= s.length;
        return true;
    }
    find_among$esjava$1(v) {
        let i = 0;
        let j = v.length;
        let c = this.cursor;
        let l = this.limit;
        let common_i = 0;
        let common_j = 0;
        let first_key_inspected = false;
        while (true) {
            let k = i + (j - i >> 1);
            let diff = 0;
            let common = common_i < common_j ? common_i : common_j;
            let w = v[k];
            let i2;
            for (i2 = common; i2 < w.s.length; i2++) {
                if (c + common === l) {
                    diff = -1;
                    break;
                }
                diff = this.current.charAt(c + common) - w.s[i2];
                if (diff !== 0)
                    break;
                common++;
            }
            if (diff < 0) {
                j = k;
                common_j = common;
            } else {
                i = k;
                common_i = common;
            }
            if (j - i <= 1) {
                if (i > 0)
                    break;
                if (j === i)
                    break;
                if (first_key_inspected)
                    break;
                first_key_inspected = true;
            }
        }
        while (true) {
            let w = v[i];
            if (common_i >= w.s.length) {
                this.cursor = c + w.s.length;
                if (w.method === null)
                    return w.result;
                let res;
                res = w.method.call(w.methodobject);
                this.cursor = c + w.s.length;
                if (res)
                    return w.result;
            }
            i = w.substring_i;
            if (i < 0)
                return 0;
        }
    }
    find_among_b$esjava$1(v) {
        let i = 0;
        let j = v.length;
        let c = this.cursor;
        let lb = this.limit_backward;
        let common_i = 0;
        let common_j = 0;
        let first_key_inspected = false;
        while (true) {
            let k = i + (j - i >> 1);
            let diff = 0;
            let common = common_i < common_j ? common_i : common_j;
            let w = v[k];
            let i2;
            for (i2 = w.s.length - 1 - common; i2 >= 0; i2--) {
                if (c - common === lb) {
                    diff = -1;
                    break;
                }
                diff = this.current.charAt(c - 1 - common) - w.s[i2];
                if (diff !== 0)
                    break;
                common++;
            }
            if (diff < 0) {
                j = k;
                common_j = common;
            } else {
                i = k;
                common_i = common;
            }
            if (j - i <= 1) {
                if (i > 0)
                    break;
                if (j === i)
                    break;
                if (first_key_inspected)
                    break;
                first_key_inspected = true;
            }
        }
        while (true) {
            let w = v[i];
            if (common_i >= w.s.length) {
                this.cursor = c - w.s.length;
                if (w.method === null)
                    return w.result;
                let res;
                res = w.method.call(w.methodobject);
                this.cursor = c - w.s.length;
                if (res)
                    return w.result;
            }
            i = w.substring_i;
            if (i < 0)
                return 0;
        }
    }
    replace_s$esjava$3(c_bra, c_ket, s) {
        let adjustment = s.length - (c_ket - c_bra);
        this.current.replace(c_bra, c_ket, s);
        this.limit += adjustment;
        if (this.cursor >= c_ket)
            this.cursor += adjustment;
        else if (this.cursor > c_bra)
            this.cursor = c_bra;
        return adjustment;
    }
    slice_check$esjava$0() {
        if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit || this.limit > this.current.length()) {
            throw new Error("Snowball: faulty slice operation");
        }
    }
    slice_from$esjava$1(s) {
        this.slice_check$esjava$0();
        this.replace_s$esjava$3(this.bra, this.ket, s);
    }
    slice_del$esjava$0() {
        this.slice_from$esjava$1("");
    }
    insert$esjava$3(c_bra, c_ket, s) {
        let adjustment = this.replace_s$esjava$3(c_bra, c_ket, s);
        if (c_bra <= this.bra)
            this.bra += adjustment;
        if (c_bra <= this.ket)
            this.ket += adjustment;
    }
    slice_to$esjava$1(s) {
        this.slice_check$esjava$0();
        s.replace(0, s.length(), this.current.substring(this.bra, this.ket));
        return s;
    }
    setCurrent(...args) {
        switch (args.length) {
        case 1:
            return this.setCurrent$esjava$1(...args);
        }
        return super.setCurrent(...args);
    }
    getCurrent(...args) {
        switch (args.length) {
        case 0:
            return this.getCurrent$esjava$0(...args);
        }
        return super.getCurrent(...args);
    }
    in_grouping(...args) {
        switch (args.length) {
        case 3:
            return this.in_grouping$esjava$3(...args);
        }
        return super.in_grouping(...args);
    }
    in_grouping_b(...args) {
        switch (args.length) {
        case 3:
            return this.in_grouping_b$esjava$3(...args);
        }
        return super.in_grouping_b(...args);
    }
    out_grouping(...args) {
        switch (args.length) {
        case 3:
            return this.out_grouping$esjava$3(...args);
        }
        return super.out_grouping(...args);
    }
    out_grouping_b(...args) {
        switch (args.length) {
        case 3:
            return this.out_grouping_b$esjava$3(...args);
        }
        return super.out_grouping_b(...args);
    }
    eq_s(...args) {
        switch (args.length) {
        case 1:
            return this.eq_s$esjava$1(...args);
        }
        return super.eq_s(...args);
    }
    eq_s_b(...args) {
        switch (args.length) {
        case 1:
            return this.eq_s_b$esjava$1(...args);
        }
        return super.eq_s_b(...args);
    }
    find_among(...args) {
        switch (args.length) {
        case 1:
            return this.find_among$esjava$1(...args);
        }
        return super.find_among(...args);
    }
    find_among_b(...args) {
        switch (args.length) {
        case 1:
            return this.find_among_b$esjava$1(...args);
        }
        return super.find_among_b(...args);
    }
    replace_s(...args) {
        switch (args.length) {
        case 3:
            return this.replace_s$esjava$3(...args);
        }
        return super.replace_s(...args);
    }
    slice_check(...args) {
        switch (args.length) {
        case 0:
            return this.slice_check$esjava$0(...args);
        }
        return super.slice_check(...args);
    }
    slice_from(...args) {
        switch (args.length) {
        case 1:
            return this.slice_from$esjava$1(...args);
        }
        return super.slice_from(...args);
    }
    slice_del(...args) {
        switch (args.length) {
        case 0:
            return this.slice_del$esjava$0(...args);
        }
        return super.slice_del(...args);
    }
    insert(...args) {
        switch (args.length) {
        case 3:
            return this.insert$esjava$3(...args);
        }
        return super.insert(...args);
    }
    slice_to(...args) {
        switch (args.length) {
        case 1:
            return this.slice_to$esjava$1(...args);
        }
        return super.slice_to(...args);
    }
}
class SnowballStemmer extends SnowballProgram {
    stem$esjava$0() {
        throw 'NotImpl < stem$esjava$0 >';
    }
    stem(...args) {
        switch (args.length) {
        case 0:
            return this.stem$esjava$0(...args);
        }
        return super.stem(...args);
    }
}

class italianStemmer extends SnowballStemmer {
    static get a_0() {
        delete italianStemmer.a_0;
        return italianStemmer.a_0 = [
            new Among("", -1, 7),
            new Among("qu", 0, 6),
            new Among("\u00E1", 0, 1),
            new Among("\u00E9", 0, 2),
            new Among("\u00ED", 0, 3),
            new Among("\u00F3", 0, 4),
            new Among("\u00FA", 0, 5)
        ];
    }
    static get a_1() {
        delete italianStemmer.a_1;
        return italianStemmer.a_1 = [
            new Among("", -1, 3),
            new Among("I", 0, 1),
            new Among("U", 0, 2)
        ];
    }
    static get a_2() {
        delete italianStemmer.a_2;
        return italianStemmer.a_2 = [
            new Among("la", -1, -1),
            new Among("cela", 0, -1),
            new Among("gliela", 0, -1),
            new Among("mela", 0, -1),
            new Among("tela", 0, -1),
            new Among("vela", 0, -1),
            new Among("le", -1, -1),
            new Among("cele", 6, -1),
            new Among("gliele", 6, -1),
            new Among("mele", 6, -1),
            new Among("tele", 6, -1),
            new Among("vele", 6, -1),
            new Among("ne", -1, -1),
            new Among("cene", 12, -1),
            new Among("gliene", 12, -1),
            new Among("mene", 12, -1),
            new Among("sene", 12, -1),
            new Among("tene", 12, -1),
            new Among("vene", 12, -1),
            new Among("ci", -1, -1),
            new Among("li", -1, -1),
            new Among("celi", 20, -1),
            new Among("glieli", 20, -1),
            new Among("meli", 20, -1),
            new Among("teli", 20, -1),
            new Among("veli", 20, -1),
            new Among("gli", 20, -1),
            new Among("mi", -1, -1),
            new Among("si", -1, -1),
            new Among("ti", -1, -1),
            new Among("vi", -1, -1),
            new Among("lo", -1, -1),
            new Among("celo", 31, -1),
            new Among("glielo", 31, -1),
            new Among("melo", 31, -1),
            new Among("telo", 31, -1),
            new Among("velo", 31, -1)
        ];
    }
    static get a_3() {
        delete italianStemmer.a_3;
        return italianStemmer.a_3 = [
            new Among("ando", -1, 1),
            new Among("endo", -1, 1),
            new Among("ar", -1, 2),
            new Among("er", -1, 2),
            new Among("ir", -1, 2)
        ];
    }
    static get a_4() {
        delete italianStemmer.a_4;
        return italianStemmer.a_4 = [
            new Among("ic", -1, -1),
            new Among("abil", -1, -1),
            new Among("os", -1, -1),
            new Among("iv", -1, 1)
        ];
    }
    static get a_5() {
        delete italianStemmer.a_5;
        return italianStemmer.a_5 = [
            new Among("ic", -1, 1),
            new Among("abil", -1, 1),
            new Among("iv", -1, 1)
        ];
    }
    static get a_6() {
        delete italianStemmer.a_6;
        return italianStemmer.a_6 = [
            new Among("ica", -1, 1),
            new Among("logia", -1, 3),
            new Among("osa", -1, 1),
            new Among("ista", -1, 1),
            new Among("iva", -1, 9),
            new Among("anza", -1, 1),
            new Among("enza", -1, 5),
            new Among("ice", -1, 1),
            new Among("atrice", 7, 1),
            new Among("iche", -1, 1),
            new Among("logie", -1, 3),
            new Among("abile", -1, 1),
            new Among("ibile", -1, 1),
            new Among("usione", -1, 4),
            new Among("azione", -1, 2),
            new Among("uzione", -1, 4),
            new Among("atore", -1, 2),
            new Among("ose", -1, 1),
            new Among("ante", -1, 1),
            new Among("mente", -1, 1),
            new Among("amente", 19, 7),
            new Among("iste", -1, 1),
            new Among("ive", -1, 9),
            new Among("anze", -1, 1),
            new Among("enze", -1, 5),
            new Among("ici", -1, 1),
            new Among("atrici", 25, 1),
            new Among("ichi", -1, 1),
            new Among("abili", -1, 1),
            new Among("ibili", -1, 1),
            new Among("ismi", -1, 1),
            new Among("usioni", -1, 4),
            new Among("azioni", -1, 2),
            new Among("uzioni", -1, 4),
            new Among("atori", -1, 2),
            new Among("osi", -1, 1),
            new Among("anti", -1, 1),
            new Among("amenti", -1, 6),
            new Among("imenti", -1, 6),
            new Among("isti", -1, 1),
            new Among("ivi", -1, 9),
            new Among("ico", -1, 1),
            new Among("ismo", -1, 1),
            new Among("oso", -1, 1),
            new Among("amento", -1, 6),
            new Among("imento", -1, 6),
            new Among("ivo", -1, 9),
            new Among("it\u00E0", -1, 8),
            new Among("ist\u00E0", -1, 1),
            new Among("ist\u00E8", -1, 1),
            new Among("ist\u00EC", -1, 1)
        ];
    }
    static get a_7() {
        delete italianStemmer.a_7;
        return italianStemmer.a_7 = [
            new Among("isca", -1, 1),
            new Among("enda", -1, 1),
            new Among("ata", -1, 1),
            new Among("ita", -1, 1),
            new Among("uta", -1, 1),
            new Among("ava", -1, 1),
            new Among("eva", -1, 1),
            new Among("iva", -1, 1),
            new Among("erebbe", -1, 1),
            new Among("irebbe", -1, 1),
            new Among("isce", -1, 1),
            new Among("ende", -1, 1),
            new Among("are", -1, 1),
            new Among("ere", -1, 1),
            new Among("ire", -1, 1),
            new Among("asse", -1, 1),
            new Among("ate", -1, 1),
            new Among("avate", 16, 1),
            new Among("evate", 16, 1),
            new Among("ivate", 16, 1),
            new Among("ete", -1, 1),
            new Among("erete", 20, 1),
            new Among("irete", 20, 1),
            new Among("ite", -1, 1),
            new Among("ereste", -1, 1),
            new Among("ireste", -1, 1),
            new Among("ute", -1, 1),
            new Among("erai", -1, 1),
            new Among("irai", -1, 1),
            new Among("isci", -1, 1),
            new Among("endi", -1, 1),
            new Among("erei", -1, 1),
            new Among("irei", -1, 1),
            new Among("assi", -1, 1),
            new Among("essi", -1, 1),
            new Among("issi", -1, 1),
            new Among("ati", -1, 1),
            new Among("iti", -1, 1),
            new Among("eresti", -1, 1),
            new Among("iresti", -1, 1),
            new Among("uti", -1, 1),
            new Among("avi", -1, 1),
            new Among("evi", -1, 1),
            new Among("ivi", -1, 1),
            new Among("isco", -1, 1),
            new Among("ando", -1, 1),
            new Among("endo", -1, 1),
            new Among("Yamo", -1, 1),
            new Among("iamo", -1, 1),
            new Among("avamo", -1, 1),
            new Among("evamo", -1, 1),
            new Among("ivamo", -1, 1),
            new Among("eremo", -1, 1),
            new Among("iremo", -1, 1),
            new Among("assimo", -1, 1),
            new Among("essimo", -1, 1),
            new Among("issimo", -1, 1),
            new Among("ammo", -1, 1),
            new Among("emmo", -1, 1),
            new Among("eremmo", 54, 1),
            new Among("iremmo", 54, 1),
            new Among("immo", -1, 1),
            new Among("ano", -1, 1),
            new Among("iscano", 58, 1),
            new Among("avano", 58, 1),
            new Among("evano", 58, 1),
            new Among("ivano", 58, 1),
            new Among("eranno", -1, 1),
            new Among("iranno", -1, 1),
            new Among("ono", -1, 1),
            new Among("iscono", 65, 1),
            new Among("arono", 65, 1),
            new Among("erono", 65, 1),
            new Among("irono", 65, 1),
            new Among("erebbero", -1, 1),
            new Among("irebbero", -1, 1),
            new Among("assero", -1, 1),
            new Among("essero", -1, 1),
            new Among("issero", -1, 1),
            new Among("ato", -1, 1),
            new Among("ito", -1, 1),
            new Among("uto", -1, 1),
            new Among("avo", -1, 1),
            new Among("evo", -1, 1),
            new Among("ivo", -1, 1),
            new Among("ar", -1, 1),
            new Among("ir", -1, 1),
            new Among("er\u00E0", -1, 1),
            new Among("ir\u00E0", -1, 1),
            new Among("er\u00F2", -1, 1),
            new Among("ir\u00F2", -1, 1)
        ];
    }
    static get g_v() {
        delete italianStemmer.g_v;
        return italianStemmer.g_v = [
            17,
            65,
            16,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            128,
            128,
            8,
            2,
            1
        ];
    }
    static get g_AEIO() {
        delete italianStemmer.g_AEIO;
        return italianStemmer.g_AEIO = [
            17,
            65,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            128,
            128,
            8,
            2
        ];
    }
    static get g_CG() {
        delete italianStemmer.g_CG;
        return italianStemmer.g_CG = [17];
    }
    get I_p2() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$I_p2') ? this._$esjava$I_p2 : this._$esjava$I_p2 = 0;
    }
    set I_p2(v) {
        this._$esjava$I_p2 = v;
    }
    get I_p1() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$I_p1') ? this._$esjava$I_p1 : this._$esjava$I_p1 = 0;
    }
    set I_p1(v) {
        this._$esjava$I_p1 = v;
    }
    get I_pV() {
        return Object.prototype.hasOwnProperty.call(this, '_$esjava$I_pV') ? this._$esjava$I_pV : this._$esjava$I_pV = 0;
    }
    set I_pV(v) {
        this._$esjava$I_pV = v;
    }
    r_prelude$esjava$0() {
        let among_var;
        let v_1;
        let v_2;
        let v_3;
        let v_4;
        let v_5;
        v_1 = this.cursor;
        replab0:
            while (true) {
                v_2 = this.cursor;
                lab1:
                    do {
                        this.bra = this.cursor;
                        among_var = this.find_among$esjava$1(italianStemmer.a_0);
                        if (among_var === 0) {
                            break lab1;
                        }
                        this.ket = this.cursor;
                        switch (among_var) {
                        case 0:
                            break lab1;
                        case 1:
                            this.slice_from$esjava$1("\u00E0");
                            break;
                        case 2:
                            this.slice_from$esjava$1("\u00E8");
                            break;
                        case 3:
                            this.slice_from$esjava$1("\u00EC");
                            break;
                        case 4:
                            this.slice_from$esjava$1("\u00F2");
                            break;
                        case 5:
                            this.slice_from$esjava$1("\u00F9");
                            break;
                        case 6:
                            this.slice_from$esjava$1("qU");
                            break;
                        case 7:
                            if (this.cursor >= this.limit) {
                                break lab1;
                            }
                            this.cursor++;
                            break;
                        }
                        continue replab0;
                    } while (false);
                this.cursor = v_2;
                break replab0;
            }
        this.cursor = v_1;
        replab2:
            while (true) {
                v_3 = this.cursor;
                lab3:
                    do {
                        golab4:
                            while (true) {
                                v_4 = this.cursor;
                                lab5:
                                    do {
                                        if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                            break lab5;
                                        }
                                        this.bra = this.cursor;
                                        lab6:
                                            do {
                                                v_5 = this.cursor;
                                                lab7:
                                                    do {
                                                        if (!this.eq_s$esjava$1("u")) {
                                                            break lab7;
                                                        }
                                                        this.ket = this.cursor;
                                                        if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                                            break lab7;
                                                        }
                                                        this.slice_from$esjava$1("U");
                                                        break lab6;
                                                    } while (false);
                                                this.cursor = v_5;
                                                if (!this.eq_s$esjava$1("i")) {
                                                    break lab5;
                                                }
                                                this.ket = this.cursor;
                                                if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                                    break lab5;
                                                }
                                                this.slice_from$esjava$1("I");
                                            } while (false);
                                        this.cursor = v_4;
                                        break golab4;
                                    } while (false);
                                this.cursor = v_4;
                                if (this.cursor >= this.limit) {
                                    break lab3;
                                }
                                this.cursor++;
                            }
                        continue replab2;
                    } while (false);
                this.cursor = v_3;
                break replab2;
            }
        return true;
    }
    r_mark_regions$esjava$0() {
        let v_1;
        let v_2;
        let v_3;
        let v_6;
        let v_8;
        this.I_pV = this.limit;
        this.I_p1 = this.limit;
        this.I_p2 = this.limit;
        v_1 = this.cursor;
        lab0:
            do {
                lab1:
                    do {
                        v_2 = this.cursor;
                        lab2:
                            do {
                                if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                    break lab2;
                                }
                                lab3:
                                    do {
                                        v_3 = this.cursor;
                                        lab4:
                                            do {
                                                if (!this.out_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                                    break lab4;
                                                }
                                                golab5:
                                                    while (true) {
                                                        lab6:
                                                            do {
                                                                if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                                                    break lab6;
                                                                }
                                                                break golab5;
                                                            } while (false);
                                                        if (this.cursor >= this.limit) {
                                                            break lab4;
                                                        }
                                                        this.cursor++;
                                                    }
                                                break lab3;
                                            } while (false);
                                        this.cursor = v_3;
                                        if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                            break lab2;
                                        }
                                        golab7:
                                            while (true) {
                                                lab8:
                                                    do {
                                                        if (!this.out_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                                            break lab8;
                                                        }
                                                        break golab7;
                                                    } while (false);
                                                if (this.cursor >= this.limit) {
                                                    break lab2;
                                                }
                                                this.cursor++;
                                            }
                                    } while (false);
                                break lab1;
                            } while (false);
                        this.cursor = v_2;
                        if (!this.out_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                            break lab0;
                        }
                        lab9:
                            do {
                                v_6 = this.cursor;
                                lab10:
                                    do {
                                        if (!this.out_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                            break lab10;
                                        }
                                        golab11:
                                            while (true) {
                                                lab12:
                                                    do {
                                                        if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                                            break lab12;
                                                        }
                                                        break golab11;
                                                    } while (false);
                                                if (this.cursor >= this.limit) {
                                                    break lab10;
                                                }
                                                this.cursor++;
                                            }
                                        break lab9;
                                    } while (false);
                                this.cursor = v_6;
                                if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                    break lab0;
                                }
                                if (this.cursor >= this.limit) {
                                    break lab0;
                                }
                                this.cursor++;
                            } while (false);
                    } while (false);
                this.I_pV = this.cursor;
            } while (false);
        this.cursor = v_1;
        v_8 = this.cursor;
        lab13:
            do {
                golab14:
                    while (true) {
                        lab15:
                            do {
                                if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                    break lab15;
                                }
                                break golab14;
                            } while (false);
                        if (this.cursor >= this.limit) {
                            break lab13;
                        }
                        this.cursor++;
                    }
                golab16:
                    while (true) {
                        lab17:
                            do {
                                if (!this.out_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                    break lab17;
                                }
                                break golab16;
                            } while (false);
                        if (this.cursor >= this.limit) {
                            break lab13;
                        }
                        this.cursor++;
                    }
                this.I_p1 = this.cursor;
                golab18:
                    while (true) {
                        lab19:
                            do {
                                if (!this.in_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                    break lab19;
                                }
                                break golab18;
                            } while (false);
                        if (this.cursor >= this.limit) {
                            break lab13;
                        }
                        this.cursor++;
                    }
                golab20:
                    while (true) {
                        lab21:
                            do {
                                if (!this.out_grouping$esjava$3(italianStemmer.g_v, 97, 249)) {
                                    break lab21;
                                }
                                break golab20;
                            } while (false);
                        if (this.cursor >= this.limit) {
                            break lab13;
                        }
                        this.cursor++;
                    }
                this.I_p2 = this.cursor;
            } while (false);
        this.cursor = v_8;
        return true;
    }
    r_postlude$esjava$0() {
        let among_var;
        let v_1;
        replab0:
            while (true) {
                v_1 = this.cursor;
                lab1:
                    do {
                        this.bra = this.cursor;
                        among_var = this.find_among$esjava$1(italianStemmer.a_1);
                        if (among_var === 0) {
                            break lab1;
                        }
                        this.ket = this.cursor;
                        switch (among_var) {
                        case 0:
                            break lab1;
                        case 1:
                            this.slice_from$esjava$1("i");
                            break;
                        case 2:
                            this.slice_from$esjava$1("u");
                            break;
                        case 3:
                            if (this.cursor >= this.limit) {
                                break lab1;
                            }
                            this.cursor++;
                            break;
                        }
                        continue replab0;
                    } while (false);
                this.cursor = v_1;
                break replab0;
            }
        return true;
    }
    r_RV$esjava$0() {
        if (!(this.I_pV <= this.cursor)) {
            return false;
        }
        return true;
    }
    r_R1$esjava$0() {
        if (!(this.I_p1 <= this.cursor)) {
            return false;
        }
        return true;
    }
    r_R2$esjava$0() {
        if (!(this.I_p2 <= this.cursor)) {
            return false;
        }
        return true;
    }
    r_attached_pronoun$esjava$0() {
        let among_var;
        this.ket = this.cursor;
        if (this.find_among_b$esjava$1(italianStemmer.a_2) === 0) {
            return false;
        }
        this.bra = this.cursor;
        among_var = this.find_among_b$esjava$1(italianStemmer.a_3);
        if (among_var === 0) {
            return false;
        }
        if (!this.r_RV$esjava$0()) {
            return false;
        }
        switch (among_var) {
        case 0:
            return false;
        case 1:
            this.slice_del$esjava$0();
            break;
        case 2:
            this.slice_from$esjava$1("e");
            break;
        }
        return true;
    }
    r_standard_suffix$esjava$0() {
        let among_var;
        let v_1;
        let v_2;
        let v_3;
        let v_4;
        this.ket = this.cursor;
        among_var = this.find_among_b$esjava$1(italianStemmer.a_6);
        if (among_var === 0) {
            return false;
        }
        this.bra = this.cursor;
        switch (among_var) {
        case 0:
            return false;
        case 1:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_del$esjava$0();
            break;
        case 2:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_del$esjava$0();
            v_1 = this.limit - this.cursor;
            lab0:
                do {
                    this.ket = this.cursor;
                    if (!this.eq_s_b$esjava$1("ic")) {
                        this.cursor = this.limit - v_1;
                        break lab0;
                    }
                    this.bra = this.cursor;
                    if (!this.r_R2$esjava$0()) {
                        this.cursor = this.limit - v_1;
                        break lab0;
                    }
                    this.slice_del$esjava$0();
                } while (false);
            break;
        case 3:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_from$esjava$1("log");
            break;
        case 4:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_from$esjava$1("u");
            break;
        case 5:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_from$esjava$1("ente");
            break;
        case 6:
            if (!this.r_RV$esjava$0()) {
                return false;
            }
            this.slice_del$esjava$0();
            break;
        case 7:
            if (!this.r_R1$esjava$0()) {
                return false;
            }
            this.slice_del$esjava$0();
            v_2 = this.limit - this.cursor;
            lab1:
                do {
                    this.ket = this.cursor;
                    among_var = this.find_among_b$esjava$1(italianStemmer.a_4);
                    if (among_var === 0) {
                        this.cursor = this.limit - v_2;
                        break lab1;
                    }
                    this.bra = this.cursor;
                    if (!this.r_R2$esjava$0()) {
                        this.cursor = this.limit - v_2;
                        break lab1;
                    }
                    this.slice_del$esjava$0();
                    switch (among_var) {
                    case 0:
                        this.cursor = this.limit - v_2;
                        break lab1;
                    case 1:
                        this.ket = this.cursor;
                        if (!this.eq_s_b$esjava$1("at")) {
                            this.cursor = this.limit - v_2;
                            break lab1;
                        }
                        this.bra = this.cursor;
                        if (!this.r_R2$esjava$0()) {
                            this.cursor = this.limit - v_2;
                            break lab1;
                        }
                        this.slice_del$esjava$0();
                        break;
                    }
                } while (false);
            break;
        case 8:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_del$esjava$0();
            v_3 = this.limit - this.cursor;
            lab2:
                do {
                    this.ket = this.cursor;
                    among_var = this.find_among_b$esjava$1(italianStemmer.a_5);
                    if (among_var === 0) {
                        this.cursor = this.limit - v_3;
                        break lab2;
                    }
                    this.bra = this.cursor;
                    switch (among_var) {
                    case 0:
                        this.cursor = this.limit - v_3;
                        break lab2;
                    case 1:
                        if (!this.r_R2$esjava$0()) {
                            this.cursor = this.limit - v_3;
                            break lab2;
                        }
                        this.slice_del$esjava$0();
                        break;
                    }
                } while (false);
            break;
        case 9:
            if (!this.r_R2$esjava$0()) {
                return false;
            }
            this.slice_del$esjava$0();
            v_4 = this.limit - this.cursor;
            lab3:
                do {
                    this.ket = this.cursor;
                    if (!this.eq_s_b$esjava$1("at")) {
                        this.cursor = this.limit - v_4;
                        break lab3;
                    }
                    this.bra = this.cursor;
                    if (!this.r_R2$esjava$0()) {
                        this.cursor = this.limit - v_4;
                        break lab3;
                    }
                    this.slice_del$esjava$0();
                    this.ket = this.cursor;
                    if (!this.eq_s_b$esjava$1("ic")) {
                        this.cursor = this.limit - v_4;
                        break lab3;
                    }
                    this.bra = this.cursor;
                    if (!this.r_R2$esjava$0()) {
                        this.cursor = this.limit - v_4;
                        break lab3;
                    }
                    this.slice_del$esjava$0();
                } while (false);
            break;
        }
        return true;
    }
    r_verb_suffix$esjava$0() {
        let among_var;
        let v_1;
        let v_2;
        v_1 = this.limit - this.cursor;
        if (this.cursor < this.I_pV) {
            return false;
        }
        this.cursor = this.I_pV;
        v_2 = this.limit_backward;
        this.limit_backward = this.cursor;
        this.cursor = this.limit - v_1;
        this.ket = this.cursor;
        among_var = this.find_among_b$esjava$1(italianStemmer.a_7);
        if (among_var === 0) {
            this.limit_backward = v_2;
            return false;
        }
        this.bra = this.cursor;
        switch (among_var) {
        case 0:
            this.limit_backward = v_2;
            return false;
        case 1:
            this.slice_del$esjava$0();
            break;
        }
        this.limit_backward = v_2;
        return true;
    }
    r_vowel_suffix$esjava$0() {
        let v_1;
        let v_2;
        v_1 = this.limit - this.cursor;
        lab0:
            do {
                this.ket = this.cursor;
                if (!this.in_grouping_b$esjava$3(italianStemmer.g_AEIO, 97, 242)) {
                    this.cursor = this.limit - v_1;
                    break lab0;
                }
                this.bra = this.cursor;
                if (!this.r_RV$esjava$0()) {
                    this.cursor = this.limit - v_1;
                    break lab0;
                }
                this.slice_del$esjava$0();
                this.ket = this.cursor;
                if (!this.eq_s_b$esjava$1("i")) {
                    this.cursor = this.limit - v_1;
                    break lab0;
                }
                this.bra = this.cursor;
                if (!this.r_RV$esjava$0()) {
                    this.cursor = this.limit - v_1;
                    break lab0;
                }
                this.slice_del$esjava$0();
            } while (false);
        v_2 = this.limit - this.cursor;
        lab1:
            do {
                this.ket = this.cursor;
                if (!this.eq_s_b$esjava$1("h")) {
                    this.cursor = this.limit - v_2;
                    break lab1;
                }
                this.bra = this.cursor;
                if (!this.in_grouping_b$esjava$3(italianStemmer.g_CG, 99, 103)) {
                    this.cursor = this.limit - v_2;
                    break lab1;
                }
                if (!this.r_RV$esjava$0()) {
                    this.cursor = this.limit - v_2;
                    break lab1;
                }
                this.slice_del$esjava$0();
            } while (false);
        return true;
    }
    stem$esjava$0() {
        let v_1;
        let v_2;
        let v_3;
        let v_4;
        let v_5;
        let v_6;
        let v_7;
        v_1 = this.cursor;
        lab0:
            do {
                if (!this.r_prelude$esjava$0()) {
                    break lab0;
                }
            } while (false);
        this.cursor = v_1;
        v_2 = this.cursor;
        lab1:
            do {
                if (!this.r_mark_regions$esjava$0()) {
                    break lab1;
                }
            } while (false);
        this.cursor = v_2;
        this.limit_backward = this.cursor;
        this.cursor = this.limit;
        v_3 = this.limit - this.cursor;
        lab2:
            do {
                if (!this.r_attached_pronoun$esjava$0()) {
                    break lab2;
                }
            } while (false);
        this.cursor = this.limit - v_3;
        v_4 = this.limit - this.cursor;
        lab3:
            do {
                lab4:
                    do {
                        v_5 = this.limit - this.cursor;
                        lab5:
                            do {
                                if (!this.r_standard_suffix$esjava$0()) {
                                    break lab5;
                                }
                                break lab4;
                            } while (false);
                        this.cursor = this.limit - v_5;
                        if (!this.r_verb_suffix$esjava$0()) {
                            break lab3;
                        }
                    } while (false);
            } while (false);
        this.cursor = this.limit - v_4;
        v_6 = this.limit - this.cursor;
        lab6:
            do {
                if (!this.r_vowel_suffix$esjava$0()) {
                    break lab6;
                }
            } while (false);
        this.cursor = this.limit - v_6;
        this.cursor = this.limit_backward;
        v_7 = this.cursor;
        lab7:
            do {
                if (!this.r_postlude$esjava$0()) {
                    break lab7;
                }
            } while (false);
        this.cursor = v_7;
        return true;
    }
    stem(...args) {
        switch (args.length) {
        case 0:
            return this.stem$esjava$0(...args);
        }
        return super.stem(...args);
    }
}

function newStemmer(lng) {
	let stemMap = {
		italian : italianStemmer
	};
	let stemmer = new stemMap[lng.toLowerCase()]();
	return {
		stem: (word) => {
			stemmer.setCurrent(word);
			stemmer.stem();
			return stemmer.getCurrent();
		}
	};
}

function algorithms() {
	return ['italian'];
}

//export {newStemmer:newStemmer,algoriths:algorithms} // versione modulo ES6
global.PorterStemmerIt = {
    newStemmer:newStemmer,
    algorithms:algorithms
}})(this) // versione ES5 per browser tradizionale

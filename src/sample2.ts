
/**
 * 非同期関数のサンプル
 * 渡された数値を一定時間経過後そのまま返す
 * numによって例外を起こす
 * @param num
 */
function asyncExceptionFunc(num: number): Promise<number> { // 非同期関数の返り値の型はPromise<>
    if (num == 90) throw "lv0. Promise外部でいきなりエラー!";
    return new Promise((resolve, reject) => {
        if (num == 91) throw "lv1. Promise内の同期部でエラー!";
        setTimeout(function () {
            if (num == 92) throw "lv2. Promise内の非同期部try-catch外でエラー!";  // これはrejectにならないっぽい。どこにもハンドルされない！
            try {
                if (num == 93) throw "lv3. Promise内の非同期でキャッチされたエラー!";
                console.log("return " + num);
                resolve(num);
            } catch (error) {
                reject(error);
            }
        }, 1000 - (num * 100)); // numが小さい方が長時間かかるようにしてみました
    });
}


/**
 * 非同期関数を順番に実行
 */
async function sequentialCall(): Promise<void> {    // 関数内でawaitを使う場合は asyncを付ける
    console.log("sequentialCall");
    const start = Date.now();
    // 逐次処理
    let result = 0;
    result += await asyncExceptionFunc(1).catch(standardErrorHandler);  // 普通に実行(エラーなし)

    // lv.0
    try {
        result += await asyncExceptionFunc(90).catch(standardErrorHandler);
    } catch (err) {
        // Promise生成前なので、Promise.catchは効かずこちらに飛んでくる
        console.log("try ... catchでハンドル:" + err);
    }

    // lv.1
    try {
        result += await asyncExceptionFunc(91).catch(standardErrorHandler);
    } catch (err) {
        console.log("try ... catchでハンドル:" + err);
    }
    // lv.2
    try {
        // このパターンはキャッチできない。
        // result += await asyncExceptionFunc(92).catch(standardErrorHandler);
    } catch (err) {
        console.log("try ... catchでハンドル:" + err);
    }

    // lv.3
    try {
        result += await asyncExceptionFunc(93).catch(standardErrorHandler);
    } catch (err) {
        console.log("try ... catchでハンドル:" + err);
    }

    const end = Date.now();
    console.log("result=" + result + " elapse:" + ((end - start) / 1000) + " sec");
}

function standardErrorHandler(reason: any): Promise<number> {
    console.log("Promise.catchでハンドル:" + reason);
    return Promise.resolve(0);  // エラーの場合の既定値として0を返す。
}

try {
    sequentialCall()
        .catch((err) => {
            console.log("トップレベルのPromise.catchでハンドル:" + err);
        });
} catch (err) {
    console.log("トップレベルのtry ... catchでハンドル:" + err);
}
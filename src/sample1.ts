
/**
 * 非同期関数のサンプル
 * 渡された数値を一定時間経過後そのまま返す
 * @param num
 */
function asyncFunc1(num: number): Promise<number> { // 非同期関数の返り値の型はPromise<>
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("return " + num);
            resolve(num);
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
    const val1 = await asyncFunc1(1);   // awaitを付けてコールで非同期処理が終わるまで待ってくれます。
    const val2 = await asyncFunc1(2);
    const val3 = await asyncFunc1(3);
    const end = Date.now();
    const result = val1 + val2 + val3 ;
    console.log("result=" + result + " elapse:" + ((end - start) / 1000) + " sec");
}

/**
 * 非同期関数を同時に実行して、全部終わったら結果を使う
 */
async function parallelCall(): Promise<void> {
    console.log("parallelCall");
    const start = Date.now();
    // 並列処理
    const [val1, val2, val3] = await Promise.all([asyncFunc1(1), asyncFunc1(2), asyncFunc1(3)]);
    const end = Date.now();
    const result = val1 + val2 + val3 ;
    console.log("result=" + result + " elapse:" + ((end - start) / 1000) + " sec");
}

// エントリーポイント
// await sequentialCall();  // こう書きたいところだけど、
// await parallelCall();    // トップベルでawaitな呼び出しは出来ないっぽい。
//                          // 何かしらのasyncな関数で包む。
(async () => {   // 関数の戻り値型を省略すると Promise<void>になるみたい
    await sequentialCall();
    await parallelCall();
})().then(() => {
    process.kill(process.pid);  // これがないと vscode debuggerが終わらない。バグ？
});

// see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html


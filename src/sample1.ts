
/**
 * 非同期に数値をそのまま返す
 * @param num
 */
function asyncFunc1(num: number): Promise<number> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log("return " + num);
            resolve(num);
        }, 1000 - (num * 100));
    });
}

/**
 * 非同期関数を順番に実行
 */
async function sequentialCall(): Promise<void> {
    console.log("sequentialCall");
    const val1 = await asyncFunc1(1);
    const val2 = await asyncFunc1(2);
    const val3 = await asyncFunc1(3);
    console.log(val1 + val2 + val3);
}


/**
 * 非同期関数を同時に実行して、全部終わったら結果を使う
 */
async function parallelCall(): Promise<void> {
    console.log("parallelCall");
    const [val1, val2, val3] = await Promise.all([asyncFunc1(1), asyncFunc1(2), asyncFunc1(3)]);
    console.log(val1 + val2 + val3);
}



// await sequentialCall();  //トップベルでawaitな呼び出しは出来ない。何かしらのasyncな関数で包む。

async function sample() {
    await sequentialCall();
    await parallelCall();
}
sample()
    .then(() => {
        process.kill(process.pid);  // for vscode debugger
    });




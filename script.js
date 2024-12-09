console.log("2024/12/09 v5 - Debug version");

// 抽選結果を保存するための変数
let currentResults = null;

// LocalStorageのキー
const HISTORY_KEY = 'lottery_history';

// 数値の安全な変換（nullやundefinedの場合は0を返す）
function safeParseInt(value) {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
}

// 安全なtoLocaleString（nullやundefinedの場合は'0'を返す）
function safeToLocaleString(number) {
    if (number === null || number === undefined) return '0';
    return Number(number).toLocaleString();
}

// 履歴を保存する関数
function saveToHistory(results) {
    if (!results) return;

    const history = getHistory();
    const historyItem = {
        date: new Date().toISOString(),
        budget: safeParseInt(results.budget),
        usedAmount: safeParseInt(results.usedAmount),
        remainingAmount: safeParseInt(results.remainingAmount),
        winners: results.selected || [],
        partialWinner: results.partialWin
    };
    history.unshift(historyItem);
    const trimmedHistory = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    displayHistory();
}

// 履歴を取得する関数
function getHistory() {
    try {
        const historyStr = localStorage.getItem(HISTORY_KEY);
        return historyStr ? JSON.parse(historyStr) : [];
    } catch (error) {
        console.error('履歴の取得に失敗:', error);
        return [];
    }
}

// 履歴を表示する関数
function displayHistory() {
    const history = getHistory();
    const historyDiv = document.getElementById('history-list');

    if (history.length === 0) {
        historyDiv.innerHTML = '<p>履歴はありません</p>';
        return;
    }

    let historyHtml = '<div class="history-items">';
    history.forEach((item, index) => {
        const date = new Date(item.date).toLocaleString('ja-JP');
        historyHtml += `
            <div class="history-item" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
                <h3>抽選 #${history.length - index} (${date})</h3>
                <p>予算: ${safeToLocaleString(item.budget)}円</p>
                <p>使用額: ${safeToLocaleString(item.usedAmount)}円</p>
                <p>残額: ${safeToLocaleString(item.remainingAmount)}円</p>
                <h4>当選者:</h4>
                <ul>
                    ${(item.winners || []).map(w => `<li>${w.email} - ${safeToLocaleString(w.amount)}円</li>`).join('')}
                </ul>
                ${item.partialWinner ? `
                    <h4>部分当選者:</h4>
                    <p>${item.partialWinner.email} - ${safeToLocaleString(item.partialWinner.awardedAmount)}円 
                       (申請額: ${safeToLocaleString(item.partialWinner.requestedAmount)}円)</p>
                ` : ''}
            </div>
        `;
    });
    historyHtml += '</div>';
    historyDiv.innerHTML = historyHtml;
}

// CSVをダウンロードする関数
function downloadResults() {
    if (!currentResults) {
        console.error('ダウンロード用のデータがありません');
        return;
    }

    try {
        const rows = [
            ['メールアドレス', '当選額', '申請額', '当選タイプ']
        ];

        // 完全当選者
        if (currentResults.selected && Array.isArray(currentResults.selected)) {
            currentResults.selected.forEach(winner => {
                rows.push([
                    winner.email,
                    safeToLocaleString(winner.amount),
                    safeToLocaleString(winner.amount),
                    '完全当選'
                ]);
            });
        }

        // 部分当選者
        if (currentResults.partialWin) {
            rows.push([
                currentResults.partialWin.email,
                safeToLocaleString(currentResults.partialWin.awardedAmount),
                safeToLocaleString(currentResults.partialWin.requestedAmount),
                '部分当選'
            ]);
        }

        // CSV文字列の生成
        const csvContent = rows
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        // ダウンロード用のリンクを作成
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `抽選結果_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    } catch (error) {
        console.error('CSVダウンロード中にエラーが発生:', error);
        alert('CSVのダウンロードに失敗しました。');
    }
}

function submitForm() {
    const fileInput = document.getElementById("csv-file");
    const budgetInput = document.getElementById("budget");
    const resultDiv = document.getElementById("result");
    const downloadArea = document.getElementById("download-area");

    // 入力値のバリデーション
    if (!fileInput.files[0]) {
        alert("CSVファイルをアップロードしてください。");
        return;
    }

    if (!budgetInput.value) {
        alert("抽選予算金額を入力してください。");
        return;
    }

    const budget = safeParseInt(budgetInput.value);
    if (budget <= 0) {
        alert("有効な予算金額を入力してください。");
        return;
    }

    const excludeInput = document.getElementById("exclude").value;
    const excludeList = excludeInput.split(",").map(email => email.trim()).filter(email => email);

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const csvData = event.target.result;
            const rows = csvData.split("\n")
                .map(row => row.trim())
                .filter(row => row.length > 0)
                .map(row => row.split(",").map(cell => cell.trim()));

            if (rows.length === 0) {
                throw new Error("CSVファイルが空です。");
            }

            const header = rows[0];

            const emailIndex = header.findIndex(col =>
                col.includes("メール") || col.toLowerCase().includes("mail"));
            const amountIndex = header.findIndex(col =>
                col.includes("金額") || col.includes("額") || col.toLowerCase().includes("amount"));

            if (emailIndex === -1 || amountIndex === -1) {
                resultDiv.innerHTML = `
                    <p class="error">CSVファイルの形式が正しくありません。</p>
                    <p>以下の列が必要です：</p>
                    <ul>
                        <li>メールアドレス (または "mail"を含む列名)</li>
                        <li>金額 (または "amount"を含む列名)</li>
                    </ul>
                    <p>現在のヘッダー: ${header.join(", ")}</p>
                `;
                return;
            }

            const data = rows.slice(1).filter(row => row.length >= Math.max(emailIndex, amountIndex) + 1);

            if (data.length === 0) {
                resultDiv.innerHTML = "<p class='error'>有効なデータが見つかりませんでした。</p>";
                return;
            }

            const validData = data
                .filter(row => {
                    const email = row[emailIndex];
                    const amount = safeParseInt(row[amountIndex]);
                    return (
                        email &&
                        !excludeList.includes(email) &&
                        amount > 0
                    );
                })
                .map(row => ({
                    email: row[emailIndex],
                    amount: safeParseInt(row[amountIndex])
                }));

            if (validData.length === 0) {
                resultDiv.innerHTML = "<p class='error'>有効な申請データが見つかりませんでした。</p>";
                return;
            }

            // ランダムに並び替え
            const shuffled = validData.sort(() => Math.random() - 0.5);

            let remainingBudget = budget;
            const selected = [];
            let partialWin = null;

            // 完全当選者の選定
            for (let i = 0; i < shuffled.length - 1; i++) {
                const item = shuffled[i];
                if (item.amount <= remainingBudget) {
                    selected.push(item);
                    remainingBudget -= item.amount;
                }
            }

            // 最後の1人の部分当選処理
            const lastPerson = shuffled[shuffled.length - 1];
            if (remainingBudget > 0 && lastPerson) {
                const partialAmount = Math.min(lastPerson.amount, remainingBudget);
                partialWin = {
                    email: lastPerson.email,
                    requestedAmount: lastPerson.amount,
                    awardedAmount: partialAmount
                };
                remainingBudget -= partialAmount;
            }

            // 結果を保存
            currentResults = {
                selected,
                partialWin,
                budget,
                usedAmount: budget - remainingBudget,
                remainingAmount: remainingBudget
            };

            // 結果を表示
            let resultHtml = `
                <h3>抽選結果</h3>
                <p>完全当選者数: ${selected.length}名</p>
                <h4>完全当選者一覧:</h4>
                <ul>
            `;
            selected.forEach(item => {
                resultHtml += `<li>${item.email} - ${safeToLocaleString(item.amount)}円</li>`;
            });
            resultHtml += "</ul>";

            if (partialWin) {
                resultHtml += `
                    <h4>部分当選者:</h4>
                    <p>${partialWin.email} - ${safeToLocaleString(partialWin.awardedAmount)}円 
                    (申請額: ${safeToLocaleString(partialWin.requestedAmount)}円)</p>
                `;
            }

            resultHtml += `
                <h4>予算状況:</h4>
                <p>総予算: ${safeToLocaleString(budget)}円</p>
                <p>使用金額: ${safeToLocaleString(budget - remainingBudget)}円</p>
                <p>残額: ${safeToLocaleString(remainingBudget)}円</p>
            `;

            resultDiv.innerHTML = resultHtml;
            downloadArea.style.display = 'block';

            // 履歴に保存
            saveToHistory(currentResults);

        } catch (error) {
            console.error("エラーが発生しました:", error);
            resultDiv.innerHTML = `
                <p class="error">ファイルの処理中にエラーが発生しました。</p>
                <p>エラー内容: ${error.message}</p>
            `;
            downloadArea.style.display = 'none';
        }
    };

    reader.onerror = function (error) {
        console.error("ファイル読み込みエラー:", error);
        resultDiv.innerHTML = "<p class='error'>ファイルの読み込み中にエラーが発生しました。</p>";
        downloadArea.style.display = 'none';
    };

    reader.readAsText(fileInput.files[0]);
}

function clearHistory() {
    if (confirm('履歴を全て削除してもよろしいですか？')) {
        localStorage.removeItem(HISTORY_KEY);
        displayHistory();
    }
}

// 初期表示時に履歴を表示
displayHistory();
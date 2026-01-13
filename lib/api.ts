export const api = {
    get: async (key: string) => {
        console.log("fetching " + key)
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000)) // random delay

        // Custom logic for getting single transaction
        if (key.startsWith("transactions/")) {
            const id = key.split("/")[1];
            const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
            const transaction = allTransactions.find((t: any) => t.id === id);

            if (!transaction) throw new Error("Transaction not found"); // 404 simulation

            return {
                data: transaction
            }
        }

        const data = localStorage.getItem(key)
        if (!data) return null;
        return JSON.parse(data)
    },
    post: async (key: string, data: any) => {
        console.log("saving to " + key, data)
        await new Promise(r => setTimeout(r, 1500))

        // Transaction specific logic
        if (key === 'transactions') {
            // "Validation"
            if (!data.account_id || !data.amount || !data.transaction_type) {
                throw new Error("Missing required fields"); // 400
            }

            const newTransaction = {
                id: Math.random().toString(36).substr(2, 9),
                account_id: data.account_id,
                transaction_type: data.transaction_type,
                amount: data.amount,
                reference_number: "TXN-" + Math.random().toString(36).substr(2, 6).toUpperCase() + "-XYZ",
                status: "completed",
                recipient_account_id: data.recipient_account_id,
                description: data.description,
                created_at: new Date().toISOString()
            };

            let transactions = JSON.parse(localStorage.getItem("transactions") || '[]');
            transactions.push(newTransaction);
            localStorage.setItem("transactions", JSON.stringify(transactions));

            return {
                data: newTransaction,
                message: "Transaction completed successfully"
            }
        }

        // simular server validation
        if (key === 'users' && data.username === 'admin') {
            throw new Error("User already exists")
        }

        // simple storage
        let current = JSON.parse(localStorage.getItem(key) || '[]')
        if (!Array.isArray(current)) current = [current]

        current.push({ ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() })
        localStorage.setItem(key, JSON.stringify(current))
        return { success: true, message: "Saved!" }
    },
    update: async (key: string, id: string, updates: any) => {
        await new Promise(r => setTimeout(r, 1000))
        let current = JSON.parse(localStorage.getItem(key) || '[]')
        const index = current.findIndex((item: any) => item.id === id)
        if (index > -1) {
            current[index] = { ...current[index], ...updates }
            localStorage.setItem(key, JSON.stringify(current))
            return current[index]
        }
        throw new Error("Item not found")
    }
}

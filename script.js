document.addEventListener('DOMContentLoaded', function() {
    const fuelInput = document.getElementById('fuelInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const originalFuelDiv = document.getElementById('originalFuel');
    const redistributedFuelDiv = document.getElementById('redistributedFuel');
    const robotMessage = document.getElementById('robotMessage');

    calculateBtn.addEventListener('click', function() {
        // Obter a entrada do usuário e converter para array de números
        const inputText = fuelInput.value.trim();
        const fuelArray = inputText.split(',').map(item => parseInt(item.trim(), 10)).filter(item => !isNaN(item));
        
        // Verificar se a entrada é válida
        if (fuelArray.length === 0) {
            robotMessage.textContent = "R2-C0D3 diz: Entrada inválida! Por favor, insira números separados por vírgulas.";
            return;
        }
        
        // Exibir o array original
        originalFuelDiv.textContent = `[${fuelArray.join(', ')}]`;
        
        try {
            // Redistribuir o combustível
            const result = redistributeFuel(fuelArray);
            
            // Exibir o resultado
            redistributedFuelDiv.textContent = `[${result.join(', ')}]`;
            
            // Calcular estatísticas
            const totalFuel = fuelArray.reduce((sum, val) => sum + val, 0);
            const avgFuel = totalFuel / fuelArray.length;
            const minFuel = Math.min(...result);
            const maxFuel = Math.max(...result);
            
            robotMessage.textContent = `R2-C0D3 diz: Combustível redistribuído com sucesso! 
                Total: ${totalFuel} | Média: ${avgFuel.toFixed(2)} 
                Mínimo: ${minFuel} | Máximo: ${maxFuel} 
                Diferença: ${maxFuel - minFuel}`;
        } catch (error) {
            robotMessage.textContent = `R2-C0D3 diz: Erro! ${error.message}`;
        }
    });
});

/**
 * Redistribui o combustível entre os compartimentos para minimizar a diferença
 * entre o compartimento com mais e com menos combustível.
 * 
 * @param {number[]} fuelArray - Array com as quantidades de combustível em cada compartimento
 * @returns {number[]} - Array com as quantidades redistribuídas
 */
function redistributeFuel(fuelArray) {
    // 1. Calcular o total de combustível disponível
    const totalFuel = fuelArray.reduce((sum, val) => sum + val, 0);
    
    // 2. Determinar o número de compartimentos
    const numCompartments = fuelArray.length;
    
    // 3. Calcular o valor base (quantidade que cada compartimento deve ter idealmente)
    const baseValue = Math.floor(totalFuel / numCompartments);
    
    // 4. Calcular quanto combustível sobra após distribuir o valor base
    const remainder = totalFuel % numCompartments;
    
    // 5. Criar o array resultante preenchendo com o valor base
    const result = new Array(numCompartments).fill(baseValue);
    
    // 6. Distribuir o combustível restante (remainder) adicionando 1 a cada compartimento
    // até que todo o resto seja distribuído (isso minimiza a diferença máxima para 1)
    for (let i = 0; i < remainder; i++) {
        result[i]++;
    }
    
    // 7. Verificar se a redistribuição preservou o total de combustível
    const newTotal = result.reduce((sum, val) => sum + val, 0);
    if (newTotal !== totalFuel) {
        throw new Error('A redistribuição não preservou o total de combustível!');
    }
    
    return result;
}
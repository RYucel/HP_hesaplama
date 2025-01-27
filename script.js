function loadCSV(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}! Could not load ${url}`);
                }
                return response.text();
            })
            .then(csv => {
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(header => header.trim());
                if (lines.length <= 1) {
                    resolve([]);
                    return;
                }
                const data = lines.slice(1).map(line => {
                    const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
                    const obj = {};
                    headers.forEach((header, index) => {
                        if (header === "weight" || header === "LastMonthPrice") {
                            obj[header] = parseFloat(values[index]) || 0;
                        } else {
                            obj[header] = values[index];
                        }
                    });
                    return obj;
                }).filter(obj => obj.product !== undefined && obj.weight !== undefined && obj.LastMonthPrice !== undefined);
                resolve(data);
            })
            .catch(error => {
                console.error("Error loading or parsing CSV:", error);
                reject(error);
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let idx;
    let data;

    loadCSV('data.csv').then(loadedData => {
        data = loadedData;
        if (data && data.length > 0) {
            idx = lunr(function () {
                this.ref('product');
                this.field('product', { boost: 10 });
                this.metadataWhitelist = ['position'];

                data.forEach(function (doc) {
                    this.add(doc);
                }.bind(this));
            });

            const searchInputs = [
                { input: document.getElementById('search1'), results: document.getElementById('results1'), price: document.getElementById('price1'), changeType: document.getElementById('changeType1'), changeValue: document.getElementById('changeValue1') },
                { input: document.getElementById('search2'), results: document.getElementById('results2'), price: document.getElementById('price2'), changeType: document.getElementById('changeType2'), changeValue: document.getElementById('changeValue2') },
                { input: document.getElementById('search3'), results: document.getElementById('results3'), price: document.getElementById('price3'), changeType: document.getElementById('changeType3'), changeValue: document.getElementById('changeValue3') },
                { input: document.getElementById('search4'), results: document.getElementById('results4'), price: document.getElementById('price4'), changeType: document.getElementById('changeType4'), changeValue: document.getElementById('changeValue4') },
                { input: document.getElementById('search5'), results: document.getElementById('results5'), price: document.getElementById('price5'), changeType: document.getElementById('changeType5'), changeValue: document.getElementById('changeValue5') }
            ];
            let selectedItems = [null, null, null, null, null];
            const selectedProductsDisplay = document.getElementById("selected-products-display");
            const contributionsDiv = document.getElementById("individual-contributions");

            searchInputs.forEach((inputData, index) => {
                inputData.input.addEventListener('input', function () {
                    const query = this.value;
                    inputData.results.innerHTML = '';

                    if (query.length < 2) return;

                    if (idx) {
                        let results = idx.search(query + "*");

                        if (results.length > 0) {
                            const ul = document.createElement('ul');
                            results.forEach(result => {
                                const item = data.find(item => item.product === result.ref);
                                if (item) {
                                    const li = document.createElement('li');
                                    li.innerHTML = highlightMatch(item.product, query);
                                    li.addEventListener('click', () => {
                                        inputData.input.value = item.product;
                                        selectedItems[index] = item;
                                        inputData.results.innerHTML = '';
                                        inputData.price.textContent = `Geçen Ayki Fiyat: ${item.LastMonthPrice.toFixed(2)} TL`;
                                        calculate();
                                    });
                                    ul.appendChild(li);
                                }
                            });
                            inputData.results.appendChild(ul);
                        } else {
                            const noResults = document.createElement("li");
                            noResults.textContent = "Sonuç Bulunamadı";
                            inputData.results.appendChild(noResults);
                        }
                    } else {
                        console.log("Lunr.js index is not initialized yet.");
                    }
                });
            });

            window.calculate = function () {
                let totalCPIChange = 0;
                let individualContributions = [];

                selectedItems.forEach((item, index) => {
                    if (item) {
                        const changeType = searchInputs[index].changeType.value;
                        const changeValue = parseFloat(searchInputs[index].changeValue.value);
                        let percentageChange = 0;
                        let newPrice;
                        let individualCPIChange = 0;

                        if (!isNaN(changeValue)) {
                            if (changeType === "percentage") {
                                percentageChange = changeValue;
                                newPrice = item.LastMonthPrice * (1 + (percentageChange / 100));
                            } else if (changeType === "price") {
                                percentageChange = ((changeValue - item.LastMonthPrice) / item.LastMonthPrice) * 100;
                                newPrice = changeValue;
                            }
                            individualCPIChange = (percentageChange / 100) * item.weight;
                            totalCPIChange += individualCPIChange;

                            individualContributions.push({
                                product: item.product,
                                oldPrice: item.LastMonthPrice.toFixed(2),
                                newPrice: newPrice.toFixed(2),
                                contribution: individualCPIChange.toFixed(2),
                                percentageChange: percentageChange.toFixed(2)
                            });
                        }
                    }
                });

                let overallPercentageChange = (totalCPIChange / 100) * 100;

                document.getElementById('cpi-change').textContent = `HP Değişimi: ${overallPercentageChange.toFixed(2)}%`;

                // Display Selected Products as Table
                selectedProductsDisplay.innerHTML = "";
                if (selectedItems.some(item => item !== null)) {
                    let tableHTML = `<table class="output-table"><thead><tr><th>Ürün</th><th>Ağırlık</th><th>Fiyat</th></tr></thead><tbody>`;
                    selectedItems.forEach(item => {
                        if (item) {
                            tableHTML += `<tr><td>${item.product}</td><td>${item.weight}</td><td>${item.LastMonthPrice.toFixed(2)} TL</td></tr>`;
                        }
                    });
                    tableHTML += `</tbody></table>`;
                    selectedProductsDisplay.innerHTML = tableHTML;
                }

                // Display Individual Contributions as Table
                contributionsDiv.innerHTML = "";
                if (individualContributions.length > 0) {
                    let tableHTML = `<table class="output-table"><thead><tr><th>Ürün</th><th>Eski Fiyat</th><th>Yeni Fiyat</th><th>Katkı</th><th>Değişim</th></tr></thead><tbody>`;
                    individualContributions.forEach(contribution => {
                        tableHTML += `<tr><td>${contribution.product}</td><td>${contribution.oldPrice} TL</td><td>${contribution.newPrice} TL</td><td>${contribution.contribution} puan</td><td>${contribution.percentageChange}%</td></tr>`;
                    });
                    tableHTML += `</tbody></table>`;
                    contributionsDiv.innerHTML = tableHTML;
                }
            };

            window.clearInputs = function () {
                searchInputs.forEach(inputData => {
                    inputData.input.value = '';
                    inputData.results.innerHTML = '';
                    inputData.price.textContent = '';
                    inputData.changeValue.value = '0';
                });
                selectedItems = [null, null, null, null, null];
                document.getElementById('cpi-change').textContent = '';
                document.getElementById("selected-products-display").innerHTML = "";
                document.getElementById("individual-contributions").innerHTML = "";
            };

            const showAllItemsButton = document.getElementById('showAllItems');
            const allItemsModal = document.getElementById('allItemsModal');
            const closeModalSpan = document.getElementsByClassName("close-modal")[0];
            const allItemsTableContainer = document.getElementById('allItemsTableContainer');
            const paginationDiv = document.getElementById("pagination");

            let currentPage = 1;
            const itemsPerPage = 20;

            showAllItemsButton.onclick = function () {
                allItemsModal.style.display = "block";
                displayAllItems(currentPage);
            }

            closeModalSpan.onclick = function () {
                allItemsModal.style.display = "none";
            }

            window.onclick = function (event) {
                if (event.target == allItemsModal) {
                    allItemsModal.style.display = "none";
                }
            }

            function displayAllItems(page) {
                if (!data || data.length === 0) return;

                // Correct Sorting by Weight (Crucial Fix)
                data.sort((a, b) => {
                    const weightA = parseFloat(a.weight);
                    const weightB = parseFloat(b.weight);
                    return weightB - weightA; // Sort in descending order
                });

                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, data.length);
                const pageData = data.slice(startIndex, endIndex);

                let tableHTML = `<table class="output-table"><thead><tr><th>Ürün</th><th>Ağırlık</th><th>Fiyat</th></tr></thead><tbody>`;
                pageData.forEach(item => {
                    tableHTML += `<tr><td>${item.product}</td><td>${item.weight}</td><td>${item.LastMonthPrice.toFixed(2)} TL</td></tr>`;
                });
                tableHTML += `</tbody></table>`;
                allItemsTableContainer.innerHTML = tableHTML;
                renderPagination(page);
            }

            function renderPagination(currentPage) {
                const totalPages = Math.ceil(data.length / itemsPerPage);
                paginationDiv.innerHTML = "";

                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement("button");
                    pageButton.textContent = i;
                    if (i === currentPage) {
                        pageButton.classList.add("active");
                    }
                    pageButton.addEventListener("click", () => {
                        currentPage = i;
                        displayAllItems(currentPage);
                    });
                    paginationDiv.appendChild(pageButton);
                }
            }
        } else {
            console.warn("No data loaded from CSV. Search will not function.");
        }
    }).catch(error => {
        console.error("Error during CSV processing:", error);
    });
});

function highlightMatch(text, query) {
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<strong>${match}</strong>`);
}

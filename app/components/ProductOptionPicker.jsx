import {useState, useEffect} from 'react';
import {AddToCartButton} from './AddToCartButton';

export function ProductOptionPicker({product}) {
  console.log(product);
  const [totalCost, setTotalCost] = useState(
    product.variants.nodes[0].price?.amount || 0,
  );
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [openSections, setOpenSections] = useState({
    'Chase Side': true,
    Color: false,
    'Chaise Length': false,
    'Total Depth': false,
    Finish: false,
    'Chaise Width': false,
    Length: false,
    'Total Sofa Cushions': false,
    'Cushion Fill': false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getFieldValue = (fields, key) => {
    const field = fields.find((f) => f.key === key);
    return field ? field.value : null;
  };

  const chaiseSide = product.chaise_side?.references?.nodes || [];
  const fabricOptions = product.fabric_options?.references?.nodes || [];
  const pricingClass = product.pricing_class?.reference?.fields || [];
  const chaiseLengths = product.chaise_length?.references?.nodes || [];
  const totalDepths = product.total_depth?.references?.nodes || [];
  const legs = product.legs?.references?.nodes || [];
  const chaiseWidths = product.chaise_width?.references?.nodes || [];
  const sizes = product.size?.references?.nodes || [];
  const seatCushions = product.seat_cushions?.references?.nodes || [];
  const cushionFills = product.cushion_fill?.references?.nodes || [];

  // Set initial selections
  useEffect(() => {
    const initialSelections = {};
    if (chaiseSide.length > 0) {
      const firstSide = getFieldValue(chaiseSide[0].fields, 'chaise_side');
      initialSelections['Chase Side'] = firstSide;
    }
    if (fabricOptions.length > 0) {
      initialSelections['Color'] = getFieldValue(
        fabricOptions[0].fields,
        'name',
      );
    }
    if (chaiseLengths.length > 0) {
      const name = getFieldValue(chaiseLengths[0].fields, 'name');
      const priceAdjustment = Number(
        getFieldValue(chaiseLengths[0].fields, 'price_adjustment') || 0,
      );
      initialSelections['Chaise Length'] = `${name}${
        priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
      }`;
    }
    if (totalDepths.length > 0) {
      const title = getFieldValue(totalDepths[0].fields, 'title');
      const priceAdjustment = Number(
        getFieldValue(totalDepths[0].fields, 'price_adjustment') || 0,
      );
      initialSelections['Total Depth'] = `${title}${
        priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
      }`;
    }
    if (legs.length > 0) {
      initialSelections['Finish'] = getFieldValue(legs[0].fields, 'name');
    }
    if (chaiseWidths.length > 0) {
      const name = getFieldValue(chaiseWidths[0].fields, 'name');
      const priceAdjustment = Number(
        getFieldValue(chaiseWidths[0].fields, 'price_adjustment') || 0,
      );
      initialSelections['Chaise Width'] = `${name}${
        priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
      }`;
    }
    if (sizes.length > 0) {
      const name = getFieldValue(sizes[0].fields, 'name');
      const priceAdjustment = Number(
        getFieldValue(sizes[0].fields, 'price_adjustment') || 0,
      );
      initialSelections['Length'] = `${name}${
        priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
      }`;
    }
    if (seatCushions.length > 0) {
      const name = getFieldValue(seatCushions[0].fields, 'name');
      const priceAdjustment = Number(
        getFieldValue(seatCushions[0].fields, 'price_adjustment') || 0,
      );
      initialSelections['Total Sofa Cushions'] = `${name}${
        priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
      }`;
    }
    if (cushionFills.length > 0) {
      const name = getFieldValue(cushionFills[0].fields, 'name');
      const priceAdjustment = Number(
        getFieldValue(cushionFills[0].fields, 'price_adjustment') || 0,
      );
      initialSelections['Cushion Fill'] = `${name}${
        priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
      }`;
    }
    setSelectedOptions(initialSelections);
  }, []);

  // Update total cost when selections change
  useEffect(() => {
    let newTotalCost = Number(product.variants.nodes[0].price?.amount || 0);
    Object.values(selectedOptions).forEach((value) => {
      if (value.includes('+$')) {
        const priceMatch = value.match(/\+\$(\d+)/);
        if (priceMatch) {
          newTotalCost += Number(priceMatch[1]);
        }
      }
    });
    setTotalCost(newTotalCost);
  }, [selectedOptions, product.variants.nodes[0].price?.amount]);

  const handleOptionChange = (name, value, priceAdjustment) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cartLines = [
    {
      merchandiseId: product.variants.nodes[0].id,
      quantity,
      attributes: [
        {
          key: '_total_cost',
          value: totalCost.toString(),
        },
        ...Object.entries(selectedOptions).map(([name, value]) => ({
          key: name,
          value,
        })),
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        $
        {totalCost.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h2>

      {chaiseSide.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Chase Side')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                1
              </span>
              <span className="text-lg">Choose Chaise Side</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Chase Side'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Chase Side'] && (
            <div className="grid grid-cols-2">
              {chaiseSide.map((side) => {
                const sideValue = getFieldValue(side.fields, 'chaise_side');
                const isSelected = selectedOptions['Chase Side'] === sideValue;
                return (
                  <label
                    key={sideValue}
                    className={`flex items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Chase Side"
                      value={sideValue}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Chase Side', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{sideValue}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {fabricOptions.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Color')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                2
              </span>
              <span className="text-lg">Choose Fabric</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Color'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Color'] && (
            <div className="grid grid-cols-2">
              {fabricOptions.map((fabric) => {
                const fabricFields = fabric.fields;
                const name = getFieldValue(fabricFields, 'name');
                const tierOption = fabricFields.find(
                  (f) => f.key === 'tier_option',
                )?.references?.nodes[0];
                const tierType = tierOption
                  ? getFieldValue(tierOption.fields, 'type')
                  : null;
                const priceAdjustment = getFieldValue(
                  fabricFields,
                  'price_adjustment',
                );
                const discount =
                  getFieldValue(fabricFields, 'discount') === 'true';

                let finalPriceAdjustment = 0;
                let priceDisplay = '';

                if (tierType === 'standard') {
                  priceDisplay = ' Included';
                } else {
                  const tierPrice = getFieldValue(pricingClass, tierType);
                  if (tierPrice) {
                    finalPriceAdjustment = discount
                      ? Number(tierPrice) - Number(priceAdjustment || 0)
                      : Number(tierPrice);
                    priceDisplay = ` +$${finalPriceAdjustment}`;
                  }
                }

                const value = `${name}${priceDisplay}`;
                const isSelected = selectedOptions['Color'] === name;

                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Color"
                      value={value}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Color', name, finalPriceAdjustment)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                    <span className="text-sm text-gray-600">
                      {priceDisplay}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {chaiseLengths.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Chaise Length')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                3
              </span>
              <span className="text-lg">Choose Chaise Length</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Chaise Length'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Chaise Length'] && (
            <div className="grid grid-cols-2">
              {chaiseLengths.map((length) => {
                const name = getFieldValue(length.fields, 'name');
                const priceAdjustment = Number(
                  getFieldValue(length.fields, 'price_adjustment') || 0,
                );
                const label = `${name}${
                  priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
                }`;
                const isSelected = selectedOptions['Chaise Length'] === label;

                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Chaise Length"
                      value={label}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Chaise Length', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                    <span className="text-sm text-gray-600">
                      {priceAdjustment > 0
                        ? `+$${priceAdjustment}`
                        : 'Included'}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {totalDepths.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Total Depth')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                4
              </span>
              <span className="text-lg">Choose Total Depth</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Total Depth'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Total Depth'] && (
            <div className="grid grid-cols-2">
              {totalDepths.map((depth) => {
                const title = getFieldValue(depth.fields, 'title');
                const priceAdjustment = Number(
                  getFieldValue(depth.fields, 'price_adjustment') || 0,
                );
                const label = `${title}${
                  priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
                }`;
                const isSelected = selectedOptions['Total Depth'] === label;

                return (
                  <label
                    key={title}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Total Depth"
                      value={label}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Total Depth', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{title}</span>
                    <span className="text-sm text-gray-600">
                      {priceAdjustment > 0
                        ? `+$${priceAdjustment}`
                        : 'Included'}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {legs.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Finish')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                5
              </span>
              <span className="text-lg">Choose Legs</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Finish'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Finish'] && (
            <div className="grid grid-cols-2">
              {legs.map((leg) => {
                const name = getFieldValue(leg.fields, 'name');
                const isSelected = selectedOptions['Finish'] === name;
                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Finish"
                      value={name}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Finish', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {chaiseWidths.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Chaise Width')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                6
              </span>
              <span className="text-lg">Choose Chaise Width</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Chaise Width'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Chaise Width'] && (
            <div className="grid grid-cols-2">
              {chaiseWidths.map((width) => {
                const name = getFieldValue(width.fields, 'name');
                const priceAdjustment = Number(
                  getFieldValue(width.fields, 'price_adjustment') || 0,
                );
                const label = `${name}${
                  priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
                }`;
                const isSelected = selectedOptions['Chaise Width'] === label;

                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Chaise Width"
                      value={label}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Chaise Width', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                    <span className="text-sm text-gray-600">
                      {priceAdjustment > 0
                        ? `+$${priceAdjustment}`
                        : 'Included'}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {sizes.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Length')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                7
              </span>
              <span className="text-lg">Choose Size</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Length'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Length'] && (
            <div className="grid grid-cols-2">
              {sizes.map((size) => {
                const name = getFieldValue(size.fields, 'name');
                const priceAdjustment = Number(
                  getFieldValue(size.fields, 'price_adjustment') || 0,
                );
                const label = `${name}${
                  priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
                }`;
                const isSelected = selectedOptions['Length'] === label;

                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Length"
                      value={label}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Length', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                    <span className="text-sm text-gray-600">
                      {priceAdjustment > 0
                        ? `+$${priceAdjustment}`
                        : 'Included'}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {seatCushions.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Total Sofa Cushions')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                8
              </span>
              <span className="text-lg">Choose Seat Cushions</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Total Sofa Cushions'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Total Sofa Cushions'] && (
            <div className="grid grid-cols-2">
              {seatCushions.map((cushion) => {
                const name = getFieldValue(cushion.fields, 'name');
                const priceAdjustment = Number(
                  getFieldValue(cushion.fields, 'price_adjustment') || 0,
                );
                const label = `${name}${
                  priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
                }`;
                const isSelected =
                  selectedOptions['Total Sofa Cushions'] === label;

                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Total Sofa Cushions"
                      value={label}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange(
                          'Total Sofa Cushions',
                          e.target.value,
                        )
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                    <span className="text-sm text-gray-600">
                      {priceAdjustment > 0
                        ? `+$${priceAdjustment}`
                        : 'Included'}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {cushionFills.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('Cushion Fill')}
            className="w-full flex items-center justify-between p-4 bg-[#8D7161] text-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#8D7161] font-bold">
                9
              </span>
              <span className="text-lg">Choose Cushion Fill</span>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                openSections['Cushion Fill'] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections['Cushion Fill'] && (
            <div className="grid grid-cols-2">
              {cushionFills.map((fill) => {
                const name = getFieldValue(fill.fields, 'name');
                const priceAdjustment = Number(
                  getFieldValue(fill.fields, 'price_adjustment') || 0,
                );
                const label = `${name}${
                  priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
                }`;
                const isSelected = selectedOptions['Cushion Fill'] === label;

                return (
                  <label
                    key={name}
                    className={`flex flex-col items-center justify-center p-6 cursor-pointer border ${
                      isSelected ? 'bg-[#F5F1EE]' : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="Cushion Fill"
                      value={label}
                      checked={isSelected}
                      onChange={(e) =>
                        handleOptionChange('Cushion Fill', e.target.value)
                      }
                      className="hidden"
                    />
                    <span className="text-lg">{name}</span>
                    <span className="text-sm text-gray-600">
                      {priceAdjustment > 0
                        ? `+$${priceAdjustment}`
                        : 'Included'}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-20 rounded- curborder-gray-300 shadow-sm focus:border-[#8D7161] focus:ring-[#8D7161]"
        />
      </div>

      <div className="mt-4">
        <AddToCartButton
          lines={cartLines}
          analytics={{
            products: [
              {
                name: product.title,
                price: totalCost,
              },
            ],
          }}
        >
          <div className="w-full bg-black text-white py-3 px-4 rounded-md cursor-pointer">
            Add to Cart
          </div>
        </AddToCartButton>
      </div>
    </div>
  );
}

import {useState, useEffect} from 'react';
import {AddToCartButton} from './AddToCartButton';

export function ProductOptionPicker({product}) {
  const [totalCost, setTotalCost] = useState(
    product.variants.nodes[0].price?.amount || 0,
  );
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);

  const getFieldValue = (fields, key) => {
    const field = fields.find((f) => f.key === key);
    return field ? field.value : null;
  };

  const chaiseSide = product.chaise_side?.reference?.fields || [];
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
    <div>
      <h2>
        $
        {totalCost.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h2>

      {chaiseSide.length > 0 && (
        <div>
          <p>Choose Chaise Side</p>
          {chaiseSide.map((side) => {
            const sideValue = getFieldValue(side.fields, 'chaise_side');
            return (
              <div key={sideValue}>
                <input
                  type="radio"
                  id={sideValue}
                  name="Chase Side"
                  value={sideValue}
                  checked={selectedOptions['Chase Side'] === sideValue}
                  onChange={(e) =>
                    handleOptionChange('Chase Side', e.target.value)
                  }
                />
                <label htmlFor={sideValue}>
                  {sideValue.charAt(0).toUpperCase() + sideValue.slice(1)}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {fabricOptions.length > 0 && (
        <div>
          <p>Choose Fabric</p>
          {fabricOptions.map((fabric) => {
            const fabricFields = fabric.fields;
            const name = getFieldValue(fabricFields, 'name');
            const tierOption = fabricFields.find((f) => f.key === 'tier_option')
              ?.references?.nodes[0];
            const tierType = tierOption
              ? getFieldValue(tierOption.fields, 'type')
              : null;
            const priceAdjustment = getFieldValue(
              fabricFields,
              'price_adjustment',
            );
            const discount = getFieldValue(fabricFields, 'discount') === 'true';

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

            return (
              <div key={name}>
                <input
                  type="radio"
                  id={`fabric-${name.toLowerCase().replace(/\s+/g, '-')}`}
                  name="Color"
                  value={value}
                  checked={selectedOptions['Color'] === name}
                  onChange={(e) =>
                    handleOptionChange('Color', name, finalPriceAdjustment)
                  }
                />
                <label
                  htmlFor={`fabric-${name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {name}
                  {priceDisplay}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {chaiseLengths.length > 0 && (
        <div>
          <p>Choose Chaise Length</p>
          {chaiseLengths.map((length) => {
            const name = getFieldValue(length.fields, 'name');
            const priceAdjustment = Number(
              getFieldValue(length.fields, 'price_adjustment') || 0,
            );
            const label = `${name}${
              priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
            }`;

            return (
              <div key={name}>
                <input
                  type="radio"
                  id={name}
                  name="Chaise Length"
                  value={label}
                  checked={selectedOptions['Chaise Length'] === label}
                  onChange={(e) =>
                    handleOptionChange('Chaise Length', e.target.value)
                  }
                />
                <label htmlFor={name}>{label}</label>
              </div>
            );
          })}
        </div>
      )}

      {totalDepths.length > 0 && (
        <div>
          <p>Choose Total Depth</p>
          {totalDepths.map((depth) => {
            const title = getFieldValue(depth.fields, 'title');
            const priceAdjustment = Number(
              getFieldValue(depth.fields, 'price_adjustment') || 0,
            );
            const label = `${title}${
              priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
            }`;

            return (
              <div key={title}>
                <input
                  type="radio"
                  id={title}
                  name="Total Depth"
                  value={label}
                  checked={selectedOptions['Total Depth'] === label}
                  onChange={(e) =>
                    handleOptionChange('Total Depth', e.target.value)
                  }
                />
                <label htmlFor={title}>{label}</label>
              </div>
            );
          })}
        </div>
      )}

      {legs.length > 0 && (
        <div>
          <p>Choose Legs</p>
          {legs.map((leg) => {
            const name = getFieldValue(leg.fields, 'name');
            return (
              <div key={name}>
                <input
                  type="radio"
                  id={name}
                  name="Finish"
                  value={name}
                  checked={selectedOptions['Finish'] === name}
                  onChange={(e) => handleOptionChange('Finish', e.target.value)}
                />
                <label htmlFor={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {chaiseWidths.length > 0 && (
        <div>
          <p>Choose Chaise Width</p>
          {chaiseWidths.map((width) => {
            const name = getFieldValue(width.fields, 'name');
            const priceAdjustment = Number(
              getFieldValue(width.fields, 'price_adjustment') || 0,
            );
            const label = `${name}${
              priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
            }`;

            return (
              <div key={name}>
                <input
                  type="radio"
                  id={name}
                  name="Chaise Width"
                  value={label}
                  checked={selectedOptions['Chaise Width'] === label}
                  onChange={(e) =>
                    handleOptionChange('Chaise Width', e.target.value)
                  }
                />
                <label htmlFor={name}>{label}</label>
              </div>
            );
          })}
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p>Choose Size</p>
          {sizes.map((size) => {
            const name = getFieldValue(size.fields, 'name');
            const priceAdjustment = Number(
              getFieldValue(size.fields, 'price_adjustment') || 0,
            );
            const label = `${name}${
              priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
            }`;

            return (
              <div key={name}>
                <input
                  type="radio"
                  id={name}
                  name="Length"
                  value={label}
                  checked={selectedOptions['Length'] === label}
                  onChange={(e) => handleOptionChange('Length', e.target.value)}
                />
                <label htmlFor={name}>{label}</label>
              </div>
            );
          })}
        </div>
      )}

      {seatCushions.length > 0 && (
        <div>
          <p>Choose Seat Cushions</p>
          {seatCushions.map((cushion) => {
            const name = getFieldValue(cushion.fields, 'name');
            const priceAdjustment = Number(
              getFieldValue(cushion.fields, 'price_adjustment') || 0,
            );
            const label = `${name}${
              priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
            }`;

            return (
              <div key={name}>
                <input
                  type="radio"
                  id={name}
                  name="Total Sofa Cushions"
                  value={label}
                  checked={selectedOptions['Total Sofa Cushions'] === label}
                  onChange={(e) =>
                    handleOptionChange('Total Sofa Cushions', e.target.value)
                  }
                />
                <label htmlFor={name}>{label}</label>
              </div>
            );
          })}
        </div>
      )}

      {cushionFills.length > 0 && (
        <div>
          <p>Choose Cushion Fill</p>
          {cushionFills.map((fill) => {
            const name = getFieldValue(fill.fields, 'name');
            const priceAdjustment = Number(
              getFieldValue(fill.fields, 'price_adjustment') || 0,
            );
            const label = `${name}${
              priceAdjustment > 0 ? ` +$${priceAdjustment}` : ' Included'
            }`;

            return (
              <div key={name}>
                <input
                  type="radio"
                  id={name}
                  name="Cushion Fill"
                  value={label}
                  checked={selectedOptions['Cushion Fill'] === label}
                  onChange={(e) =>
                    handleOptionChange('Cushion Fill', e.target.value)
                  }
                />
                <label htmlFor={name}>{label}</label>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

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
        Add to Cart
      </AddToCartButton>
    </div>
  );
}

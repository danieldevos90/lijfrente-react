import React, { useState, useEffect, useMemo } from 'react';
import { TextInput, Box, Flex, Select, Option, Typography, Grid, Button } from '@strapi/design-system';
import { Search } from '@strapi/icons';
import { useField } from '@strapi/strapi/admin';

interface Icon {
  path: string;
  name: string;
  category: string;
}

const IconSelector = () => {
  const { value, onChange, name, error } = useField<string>({
    type: 'string',
  });

  const [icons, setIcons] = useState<Icon[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load icons from the JSON file
    fetch('/icons.json')
      .then((res) => res.json())
      .then((data) => {
        setIcons(data.icons || []);
        setCategories(['all', ...(data.categories || [])]);
      })
      .catch((err) => {
        console.error('Failed to load icons:', err);
      });
  }, []);

  const filteredIcons = useMemo(() => {
    let filtered = icons;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((icon) => icon.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (icon) =>
          icon.name.toLowerCase().includes(term) ||
          icon.path.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [icons, selectedCategory, searchTerm]);

  const handleIconSelect = (iconPath: string) => {
    onChange({ target: { name, value: iconPath } });
    setIsOpen(false);
  };

  return (
    <Box>
      <Flex direction="column" gap={2}>
        <TextInput
          name={name}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ target: { name, value: e.target.value } })
          }
          placeholder="/icons/SVG/interface/zap.svg"
          error={error}
        />
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          fullWidth
        >
          {isOpen ? 'Hide Icon Selector' : 'Browse Icons'}
        </Button>

        {isOpen && (
          <Box
            padding={4}
            background="neutral0"
            borderColor="neutral200"
            borderStyle="solid"
            borderWidth="1px"
            borderRadius="4px"
            shadow="tableShadow"
            style={{ maxHeight: '500px', overflow: 'auto' }}
          >
            <Flex direction="column" gap={3}>
              <Flex gap={2}>
                <Box flex="1">
                  <TextInput
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    startAction={<Search />}
                  />
                </Box>
                <Select
                  value={selectedCategory}
                  onChange={(val: string) => setSelectedCategory(val)}
                  style={{ width: '200px' }}
                >
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </Option>
                  ))}
                </Select>
              </Flex>

              <Typography variant="pi" textColor="neutral600">
                {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} found
              </Typography>

              <Grid gap={2} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                {filteredIcons.map((icon) => (
                  <Button
                    key={icon.path}
                    variant={value === icon.path ? 'default' : 'secondary'}
                    onClick={() => handleIconSelect(icon.path)}
                    style={{
                      flexDirection: 'column',
                      height: 'auto',
                      padding: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      as="img"
                      src={icon.path}
                      alt={icon.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        marginBottom: '8px',
                      }}
                    />
                    <Typography variant="pi" style={{ fontSize: '11px', textAlign: 'center' }}>
                      {icon.name}
                    </Typography>
                  </Button>
                ))}
              </Grid>

              {filteredIcons.length === 0 && (
                <Box padding={4} textAlign="center">
                  <Typography variant="pi" textColor="neutral600">
                    No icons found. Try a different search term or category.
                  </Typography>
                </Box>
              )}
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default IconSelector;


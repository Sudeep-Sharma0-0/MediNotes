using System.Text.Json.Serialization;

namespace MediNotes.Api.Models
{
  [JsonPolymorphic(TypeDiscriminatorPropertyName = "Type")]
  [JsonDerivedType(typeof(HeadingBlock), typeDiscriminator: "heading")]
  [JsonDerivedType(typeof(ParagraphBlock), typeDiscriminator: "paragraph")]
  [JsonDerivedType(typeof(TodoBlock), typeDiscriminator: "todo")]
  [JsonDerivedType(typeof(ImageBlock), typeDiscriminator: "image")]
  [JsonDerivedType(typeof(BulletedListBlock), typeDiscriminator: "bulleted-list")]
  [JsonDerivedType(typeof(OrderedListBlock), typeDiscriminator: "ordered-list")]
  [JsonDerivedType(typeof(TableBlock), typeDiscriminator: "table")]
  [JsonDerivedType(typeof(CodeBlock), typeDiscriminator: "code")]
  public abstract class ContentBlock
  {
    public Guid Id { get; set; }
    public abstract string Type { get; }

    protected ContentBlock()
    {
      Id = Guid.NewGuid();
    }
  }

  public class TextSpan
  {
    public string Text { get; set; } = string.Empty;
    public List<string> Marks { get; set; } = new();
  }

  public class HeadingBlock : ContentBlock
  {
    public const string BlockType = "heading";
    public override string Type => BlockType;
    public int Level { get; set; }
    public List<TextSpan> Content { get; set; } = new();
    public string? Alignment { get; set; }
  }

  public class ParagraphBlock : ContentBlock
  {
    public const string BlockType = "paragraph";
    public override string Type => BlockType;
    public List<TextSpan> Content { get; set; } = new();
    public string? Alignment { get; set; }
  }

  public class ImageBlock : ContentBlock
  {
    public const string BlockType = "image";
    public override string Type => BlockType;
    public string SourceUrl { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
  }

  public class BulletedListBlock : ContentBlock
  {
    public const string BlockType = "bulleted-list";
    public override string Type => BlockType;
    public List<List<TextSpan>> Items { get; set; } = new();
  }

  public class OrderedListBlock : ContentBlock
  {
    public const string BlockType = "ordered-list";
    public override string Type => BlockType;
    public int StartNumber { get; set; } = 1;
    public List<List<TextSpan>> Items { get; set; } = new();
  }

  public class TodoBlock : ContentBlock
  {
    public const string BlockType = "todo";
    public override string Type => BlockType;
    public List<TextSpan> Content { get; set; } = new();
    public bool IsChecked { get; set; }
  }

  public class TableBlock : ContentBlock
  {
    public const string BlockType = "table";
    public override string Type => BlockType;
    public List<List<TextSpan>> Headers { get; set; } = new();
    public List<List<List<TextSpan>>> Rows { get; set; } = new();
  }

  public class CodeBlock : ContentBlock
  {
    public const string BlockType = "code";
    public override string Type => BlockType;
    public string? Language { get; set; }
    public string Code { get; set; } = string.Empty;
  }
}
